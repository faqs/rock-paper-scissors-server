import {Variants} from "../../commonTypes";

export class CreateNewGameDto {
  playerNickname: string;
  totalRounds: number;
}

export class ConnectToGameDto {
  playerNickname: string;
  gameId: number;
}

export class MakeTurnDto {
  playerNickname: string;
  variant: Variants;
  gameId: number;
}
