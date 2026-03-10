const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 6) {
  const values = crypto.getRandomValues(new Uint32Array(length));

  return Array.from(values, (value) => ROOM_CODE_CHARS[value % ROOM_CODE_CHARS.length]).join("");
}

export function sanitizeRoomCode(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}