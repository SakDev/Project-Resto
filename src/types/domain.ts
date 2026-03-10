export type RoomStatus =
  | "draft"
  | "collecting_preferences"
  | "fetching_candidates"
  | "voting"
  | "ranking"
  | "results"
  | "archived"
  | "cancelled";

export type VoteValue = "yes" | "maybe" | "no" | "skip";

export type IdentityType = "guest" | "profile";

export type RoomMember = {
  id: string;
  displayName: string;
  identityType: IdentityType;
  isOnline: boolean;
  joinedAt: string;
};

export type Room = {
  id: string;
  code: string;
  status: RoomStatus;
  title: string;
  locationLabel: string;
  radiusKm: number;
  candidateLimit: number;
  members: RoomMember[];
};

export type RestaurantCandidate = {
  id: string;
  externalSource: "google" | "yelp" | "foursquare" | "mock";
  externalId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  priceLevel?: number;
  categories: string[];
  openNow?: boolean;
  photoUrl?: string;
};

export type VoteRecord = {
  restaurantId: string;
  memberId: string;
  value: VoteValue;
};

export type RankedRestaurant = RestaurantCandidate & {
  yesCount: number;
  maybeCount: number;
  noCount: number;
  vetoed: boolean;
  score: number;
  explanation: string;
};