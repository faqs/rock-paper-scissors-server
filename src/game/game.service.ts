import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Game} from "./interfaces/game.interface";
import {ConnectToGameDto, CreateNewGameDto, MakeTurnDto} from "./dto/game.dto";
import {PlayersService} from "../players/players.service";
import {GameGateway} from "./websockets/game.gateway";
import {getGameWinner, getRoundWinner} from "../helpers/helpers";

@Injectable()
export class GameService {
  private readonly games: Game[] = [];

  constructor(private readonly playersService: PlayersService, private gameGateway: GameGateway) {}

  getGameById(gameId: number): Game {
    if(!gameId) {
      throw new HttpException('Game id must be specified', HttpStatus.BAD_REQUEST);
    }
    const game = this.games.find(({id}) => gameId === id);

    if(!game) {
      throw new HttpException('The game not found', HttpStatus.NOT_FOUND);
    }

    return game;
  }

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
      rounds: [],
      isFinished: false,
    }

    this.games.push(newGame);

    return newGame;
  }

  connectToGame(connectToGameData: ConnectToGameDto): Game {
    const game = this.getGameById(connectToGameData.gameId);

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
    const player = this.playersService.getPlayer(makeTurnData.playerNickname);
    const game = this.getGameById(makeTurnData.gameId);

    if(game.isFinished) {
      throw new HttpException('The game is already finished', HttpStatus.BAD_REQUEST);
    }

    const playerFieldName = player.id === game.firstPlayerId ? 'firstVariant' : 'secondVariant'
    let round = game.rounds[game.currentRound-1];

    if (round && round[playerFieldName]) {
      throw new HttpException('You can not make another turn in round', HttpStatus.BAD_REQUEST);
    }

    if(!round) {
      round = {};
      game.rounds.push(round);
    }

    round[playerFieldName] = {
      playerNickname: player.nickname,
      variant: makeTurnData.variant,
    };

    if(round.firstVariant && round.secondVariant) {
      const roundWinner = getRoundWinner(round.firstVariant, round.secondVariant);

      if(game.currentRound !== game.totalRounds) {
        game.currentRound++;
      } else {
        game.isFinished = true;
        game.gameWinner = getGameWinner(game.rounds);
      }

      this.gameGateway.sendRoundResult( {
        game,
        winner: roundWinner,
      });
    }

    return game;
  }
}
