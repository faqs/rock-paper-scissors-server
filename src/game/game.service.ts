import { Injectable } from '@nestjs/common';
import {Game} from "./interfaces/game.interface";
import {ConnectToGameDto, CreateNewGameDto, MakeTurnDto} from "./dto/game.dto";
import {PlayersService} from "../players/players.service";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(private readonly playersService: PlayersService) {}

  createNewGame(newGameData: CreateNewGameDto): Game {
    let player = this.playersService.getPlayer(newGameData.playerNickname);

    if(!player) {
      player = this.playersService.createNewPlayer(newGameData.playerNickname);
    }

    const newGame = {
      id: this.games.length + 1,
      firstPlayerId: player.id,
      totalRounds: newGameData.totalRounds,
      currentRound: 1,
    }

    this.games.push(newGame);

    return newGame;
  }

  connectToGame(connectToGameData: ConnectToGameDto): Game {
    const game = this.games.find(({id}) => connectToGameData.gameId);

    if(!game) {
      throw new Error('The game not found');
    }

    let player = this.playersService.getPlayer(connectToGameData.playerNickname);

    if(!player) {
      player = this.playersService.createNewPlayer(connectToGameData.playerNickname);
    }

    game.secondPlayerId = player.id;

    return game;
  }

  makeTurn(makeTurnData: MakeTurnDto) {
    return `You made a turn with ${makeTurnData.variant}`;
  }
}
