export type Step = "prefs" | "vote" | "results";
export type VoteChoice = "yes" | "meh" | "no";
export type LeanChoice = "lean-no" | "meh" | "lean-yes";
export type TimeSlot = "lunch" | "dinner" | "late";
export type CuisinePreference = "yes" | "meh" | "no";

export type VoteRecord = {
  vote: VoteChoice;
  lean: LeanChoice;
};

export type RestaurantSeed = {
  id: string;
  name: string;
  cuisine: string;
  distanceM: number;
};

export const LEAN_LABELS: Record<LeanChoice, string> = {
  "lean-no": "leaning no",
  meh: "plain meh",
  "lean-yes": "leaning yes",
};
