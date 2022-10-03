import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Game} from "./interfaces/game.interface";
import {ConnectToGameDto, CreateNewGameDto, MakeTurnDto} from "./dto/game.dto";
import {PlayersService} from "../players/players.service";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(private readonly playersService: PlayersService) {}

  createNewGame(newGameData: CreateNewGameDto): Game {
    if(!newGameData.playerNickname) {
      throw new HttpException('Nickname must be specified', HttpStatus.BAD_REQUEST);
    }

    if(!newGameData.totalRounds) {
      throw new HttpException('Total amount of rounds must be specified and be greater then 0', HttpStatus.BAD_REQUEST);
    }

    let player = this.playersService.getPlayer(newGameData.playerNickname);

    if(!player) {
      player = this.playersService.createNewPlayer(newGameData.playerNickname);
    }

    const newGame = {
      id: this.games.length + 1,
      firstPlayerId: player.id,
      totalRounds: newGameData.totalRounds,
      currentRound: 1,
      rounds: [],
    }

    this.games.push(newGame);

    return newGame;
  }

  connectToGame(connectToGameData: ConnectToGameDto): Game {
    if(!connectToGameData.gameId) {
      throw new HttpException('Game id must be specified', HttpStatus.BAD_REQUEST);
    }

    if(!connectToGameData.playerNickname) {
      throw new HttpException('Nickname must be specified', HttpStatus.BAD_REQUEST);
    }

    const game = this.games.find(({id}) => connectToGameData.gameId === id);

    if(!game) {
      throw new HttpException('The game not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(game.secondPlayerId) {
      throw new HttpException('The game has already maximum players', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let player = this.playersService.getPlayer(connectToGameData.playerNickname);

    if(!player) {
      player = this.playersService.createNewPlayer(connectToGameData.playerNickname);
    }

    if(player.id === game.firstPlayerId) {
      throw new HttpException('You can not connect to the same game twice', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    game.secondPlayerId = player.id;

    return game;
  }

  makeTurn(makeTurnData: MakeTurnDto) {
    return `You made a turn with ${makeTurnData.variant}`;
  }
}
