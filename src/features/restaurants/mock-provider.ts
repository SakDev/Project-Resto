import "server-only";

import type { RestaurantCandidate } from "@/types/domain";

import type { RestaurantProvider, RestaurantSearchFilters } from "./provider";

export class MockRestaurantProvider implements RestaurantProvider {
  readonly name = "mock";

  async search(filters: RestaurantSearchFilters): Promise<RestaurantCandidate[]> {
    return Array.from({ length: Math.min(filters.candidateLimit, 6) }, (_, index) => ({
      id: crypto.randomUUID(),
      externalSource: "mock",
      externalId: `mock-${index + 1}`,
      name: `Sample Restaurant ${index + 1}`,
      address: `${index + 10} Demo Street, ${filters.locationLabel}`,
      rating: 4.2 + index * 0.1,
      reviewCount: 120 + index * 17,
      priceLevel: (index % 4) + 1,
      categories: ["casual", "group-friendly"],
      openNow: true,
    }));
  }
}