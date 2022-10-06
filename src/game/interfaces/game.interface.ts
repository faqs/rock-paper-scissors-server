import {PlayerVariant} from "../../commonTypes";

export interface Game {
  id: number;
  firstPlayerId: number;
  secondPlayerId?: number;
  totalRounds: number;
  currentRound: number;
  rounds: Round[],
  isFinished: boolean;
  gameWinner?: string;
}

export interface Round {
  firstVariant?: PlayerVariant,
  secondVariant?: PlayerVariant,
}

export interface RoundResult {
  game: Game,
  winner: string;
}
