import {Variants} from "../dictionary";

export interface Game {
  id: number;
  firstPlayerId: number;
  secondPlayerId?: number;
  totalRounds: number;
  currentRound: number;
  rounds: Round[],
}

export interface Round {
  firstPlayerVariant?: Variants,
  secondPlayerVariant?: Variants,
}
