import "server-only";

import type { RestaurantCandidate } from "@/types/domain";

export type RestaurantSearchFilters = {
  locationLabel: string;
  radiusKm: number;
  candidateLimit: number;
  cuisines?: string[];
  openNowOnly?: boolean;
};

export interface RestaurantProvider {
  readonly name: string;
  search(filters: RestaurantSearchFilters): Promise<RestaurantCandidate[]>;
}