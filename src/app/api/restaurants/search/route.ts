import { NextRequest } from "next/server";
import { z } from "zod";

import { badRequest, ok, serverError } from "@/lib/http/responses";
import { assertJsonRequest } from "@/lib/security/request";

import { searchRestaurantCandidates } from "@/features/restaurants/service";

const searchSchema = z.object({
  locationLabel: z.string().min(2).max(160),
  radiusKm: z.number().int().min(1).max(50).default(5),
  candidateLimit: z.number().int().min(5).max(30).default(18),
  cuisines: z.array(z.string()).optional(),
  openNowOnly: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    assertJsonRequest(request);
    const body = await request.json();
    const parsed = searchSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Invalid restaurant search payload", parsed.error.flatten());
    }

    const result = await searchRestaurantCandidates(parsed.data);
    return ok(result);
  } catch (error) {
    console.error(error);
    return serverError("Failed to search restaurants");
  }
}