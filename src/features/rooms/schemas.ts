import { z } from "zod";

export const createRoomSchema = z.object({
  title: z.string().trim().min(2).max(80),
  locationLabel: z.string().trim().min(2).max(160),
  radiusKm: z.number().int().min(1).max(50).default(5),
  candidateLimit: z.number().int().min(5).max(30).default(18),
  hostDisplayName: z.string().trim().min(2).max(40),
});

export const joinRoomSchema = z.object({
  code: z.string().trim().min(4).max(12),
  displayName: z.string().trim().min(2).max(40),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type JoinRoomInput = z.infer<typeof joinRoomSchema>;