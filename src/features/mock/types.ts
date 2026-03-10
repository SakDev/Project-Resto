export type Step = "prefs" | "vote" | "results";
export type VoteChoice = "yes" | "ehh" | "no";
export type LeanChoice = "lean-no" | "ehh" | "lean-yes";
export type TimeSlot = "lunch" | "dinner" | "late";
export type CuisinePreference = "yes" | "maybe" | "no";

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
  ehh: "plain ehh",
  "lean-yes": "leaning yes",
};

