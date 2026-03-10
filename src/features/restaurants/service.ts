import "server-only";

import { env } from "@/lib/env";
import type { RestaurantCandidate } from "@/types/domain";

import { MockRestaurantProvider } from "./mock-provider";
import type { RestaurantSearchFilters } from "./provider";

export async function searchRestaurantCandidates(
  filters: RestaurantSearchFilters,
): Promise<{ provider: string; candidates: RestaurantCandidate[] }> {
  if (!env.GOOGLE_PLACES_API_KEY) {
    const provider = new MockRestaurantProvider();
    return {
      provider: provider.name,
      candidates: await provider.search(filters),
    };
  }

  const provider = new MockRestaurantProvider();

  return {
    provider: provider.name,
    candidates: await provider.search(filters),
  };
}