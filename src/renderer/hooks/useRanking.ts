import { useState } from "react";

const NONE = 0;
const UP = 1;
const DOWN = 2;

type Tvotes = typeof NONE | typeof UP | typeof DOWN;

export default function useRanking(
  initialRanking?: number,
  initialRankState?: Tvotes
): [number, Tvotes, () => void, () => void] {
  const [rank, setRank] = useState<number>(initialRanking ?? 0);
  const [rankState, setRankState] = useState<Tvotes>(initialRankState ?? NONE);

  const handleUpvote = () => {
    if (rankState == NONE) {
      setRank(rank + 1);
      setRankState(UP);
    }

    if (rankState == DOWN) {
      setRank(rank + 2);
      setRankState(UP);
    }

    if (rankState == UP) {
      setRank(initialRanking ?? 0);
      setRankState(NONE);
    }
  };

  const handleDownvote = () => {
    if (rankState == NONE) {
      setRank(rank - 1);
      setRankState(DOWN);
    }

    if (rankState == UP) {
      setRank(rank - 2);
      setRankState(DOWN);
    }

    if (rankState == DOWN) {
      setRank(initialRanking ?? 0);
      setRankState(NONE);
    }
  };

  return [rank, rankState, handleUpvote, handleDownvote];
}
