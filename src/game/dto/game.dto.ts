import {Variants} from "../../commonTypes";
import {IsNotEmpty} from "class-validator";

export class CreateNewGameDto {
  @IsNotEmpty()
  playerNickname: string;
  @IsNotEmpty()
  totalRounds: number;
}

export class ConnectToGameDto {
  @IsNotEmpty()
  playerNickname: string;
  @IsNotEmpty()
  gameId: number;
}

export class MakeTurnDto {
  @IsNotEmpty()
  playerNickname: string;
  @IsNotEmpty()
  variant: Variants;
  @IsNotEmpty()
  gameId: number;
}
