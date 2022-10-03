export class CreateNewGameDto {
  playerNickname: string;
  totalRounds: number;
}

export class ConnectToGameDto {
  playerNickname: string;
  gameId: number;
}

export class MakeTurnDto {
  playerId: number;
  variant: string;
  gameId: number;
}
