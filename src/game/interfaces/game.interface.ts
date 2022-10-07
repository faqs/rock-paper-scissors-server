import {PlayerVariant} from "../../commonTypes";
import {Player} from "../../players/interfaces/players.interface";

export interface GamePlayerInfo extends Player {
    isGamePaused: boolean;
}

export interface Game {
  id: number;
  firstPlayer: GamePlayerInfo;
  secondPlayer?: GamePlayerInfo;
  totalRounds: number;
  currentRound: number;
  rounds: Round[],
  isPaused: boolean;
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
