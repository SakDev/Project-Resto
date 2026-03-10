import { NextRequest } from "next/server";

import { badRequest, ok, serverError } from "@/lib/http/responses";
import { assertJsonRequest } from "@/lib/security/request";

import { joinRoomSchema } from "@/features/rooms/schemas";
import { joinRoom } from "@/features/rooms/service";

export async function POST(request: NextRequest) {
  try {
    assertJsonRequest(request);
    const body = await request.json();
    const parsed = joinRoomSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Invalid room join payload", parsed.error.flatten());
    }

    const membership = await joinRoom(parsed.data);
    return ok(membership);
  } catch (error) {
    console.error(error);
    return serverError("Failed to join room");
  }
}