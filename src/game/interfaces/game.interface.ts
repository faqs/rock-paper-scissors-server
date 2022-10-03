export interface Game {
  id: number;
  firstPlayerId: number;
  secondPlayerId?: number;
  totalRounds: number;
  currentRound: number;
}
