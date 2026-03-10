import type { TimeSlot, VoteRecord } from "@/features/mock/types";

const LATE_FRIENDLY = new Set(["pizza", "diner", "burger", "ramen", "thai", "mexican", "chinese"]);
const LUNCH_FRIENDLY = new Set([
  "thai",
  "italian",
  "japanese",
  "mexican",
  "chinese",
  "pizza",
  "burger",
  "diner",
  "indian",
  "korean",
]);

export function isOpenFor(cuisine: string, time: TimeSlot) {
  if (time === "dinner") return true;
  if (time === "late") return LATE_FRIENDLY.has(cuisine);
  return LUNCH_FRIENDLY.has(cuisine);
}

export function estimatePrice(cuisine: string, distanceM: number) {
  const premium = new Set(["steak_house", "french", "japanese"]);
  const value = new Set(["pizza", "burger", "diner", "mexican", "noodle"]);
  if (premium.has(cuisine)) return "$$$";
  if (value.has(cuisine) || distanceM < 180) return "$";
  return "$$";
}

export function scoreVote(vote: VoteRecord) {
  if (vote.vote === "no") return Number.NEGATIVE_INFINITY;
  if (vote.vote === "yes") return 1;
  if (vote.lean === "lean-no") return 0.35;
  if (vote.lean === "lean-yes") return 0.65;
  return 0.5;
}

