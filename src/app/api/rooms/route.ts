import { NextRequest } from "next/server";

import { created, badRequest, serverError } from "@/lib/http/responses";
import { assertJsonRequest } from "@/lib/security/request";

import { createRoomSchema } from "@/features/rooms/schemas";
import { createRoom } from "@/features/rooms/service";

export async function POST(request: NextRequest) {
  try {
    assertJsonRequest(request);
    const body = await request.json();
    const parsed = createRoomSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Invalid room creation payload", parsed.error.flatten());
    }

    const room = await createRoom(parsed.data);
    return created(room);
  } catch (error) {
    console.error(error);
    return serverError("Failed to create room");
  }
}