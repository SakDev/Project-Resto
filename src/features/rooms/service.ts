import "server-only";

import { appConfig } from "@/lib/config/app-config";
import { generateRoomCode, sanitizeRoomCode } from "@/lib/security/room-code";
import type { Room } from "@/types/domain";

import type { CreateRoomInput, JoinRoomInput } from "./schemas";

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  return {
    id: crypto.randomUUID(),
    code: generateRoomCode(),
    status: "draft",
    title: input.title,
    locationLabel: input.locationLabel,
    radiusKm: input.radiusKm,
    candidateLimit: input.candidateLimit,
    members: [
      {
        id: crypto.randomUUID(),
        displayName: input.hostDisplayName,
        identityType: "guest",
        isOnline: true,
        joinedAt: new Date().toISOString(),
      },
    ],
  };
}

export async function joinRoom(input: JoinRoomInput) {
  return {
    roomId: crypto.randomUUID(),
    code: sanitizeRoomCode(input.code),
    memberId: crypto.randomUUID(),
    displayName: input.displayName,
    constraints: {
      minMembers: appConfig.room.minMembers,
      maxMembers: appConfig.room.maxMembers,
    },
  };
}