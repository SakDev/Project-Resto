import type { RankedRestaurant, RestaurantCandidate, VoteRecord } from "@/types/domain";

export function rankRestaurants(
  restaurants: RestaurantCandidate[],
  votes: VoteRecord[],
): RankedRestaurant[] {
  return restaurants
    .map((restaurant) => {
      const restaurantVotes = votes.filter((vote) => vote.restaurantId === restaurant.id);
      const yesCount = restaurantVotes.filter((vote) => vote.value === "yes").length;
      const maybeCount = restaurantVotes.filter((vote) => vote.value === "maybe").length;
      const noCount = restaurantVotes.filter((vote) => vote.value === "no").length;
      const vetoed = noCount > 0;
      const score = vetoed ? Number.NEGATIVE_INFINITY : yesCount + maybeCount * 0.5;

      return {
        ...restaurant,
        yesCount,
        maybeCount,
        noCount,
        vetoed,
        score,
        explanation: vetoed
          ? `Excluded because ${noCount} participant vetoed it.`
          : `Liked by ${yesCount} people with ${maybeCount} maybe votes and no vetoes.`,
      } satisfies RankedRestaurant;
    })
    .sort((left, right) => {
      if (left.vetoed !== right.vetoed) return left.vetoed ? 1 : -1;
      if (right.score !== left.score) return right.score - left.score;
      if ((right.rating ?? 0) !== (left.rating ?? 0)) return (right.rating ?? 0) - (left.rating ?? 0);
      return left.name.localeCompare(right.name);
    });
}