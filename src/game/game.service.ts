import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Game} from "./interfaces/game.interface";
import {ConnectToGameDto, ContinueGameDto, CreateNewGameDto, MakeTurnDto, PauseGameDto} from "./dto/game.dto";
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
      firstPlayer: {
        ...player,
        isGamePaused: false,
      },
      totalRounds: newGameData.totalRounds,
      currentRound: 1,
      rounds: [],
      isPaused: false,
      isFinished: false,
    }

    this.games.push(newGame);

    return newGame;
  }

  connectToGame(connectToGameData: ConnectToGameDto): Game {
    const game = this.getGameById(connectToGameData.gameId);
    const gamePlayers = [game.firstPlayer, game.secondPlayer];

    if(game.isFinished) {
      throw new HttpException('The game is already finished', HttpStatus.BAD_REQUEST);
    }

    let player = this.playersService.getPlayer(connectToGameData.playerNickname);

    if(!game.secondPlayer) {
      if(player?.id === game.firstPlayer.id) {
        if(game.isPaused) {
          game.firstPlayer.isGamePaused = false;
          game.isPaused = false;
        } else {
          throw new HttpException('You can not connect to the same game twice', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        if(!player) {
          player = this.playersService.createNewPlayer(connectToGameData.playerNickname);
        }

        game.secondPlayer = {
          ...player,
          isGamePaused: false,
        };
        game.isPaused = game.firstPlayer.isGamePaused;
      }
    } else {
      if(!player || (player.id !== game.firstPlayer.id && player.id !== game.secondPlayer.id)) {
        throw new HttpException('The game has already maximum players', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        if(!game.isPaused) {
          throw new HttpException('You can not connect to the same game twice', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
          if(!gamePlayers.find(({id}) => id === player.id).isGamePaused) {
            throw new HttpException('You can not connect to the same game twice', HttpStatus.INTERNAL_SERVER_ERROR);
          } else {
            gamePlayers.find(({id}) => id === player.id).isGamePaused = false;
            game.isPaused = game.firstPlayer.isGamePaused || game.secondPlayer.isGamePaused;
          }
        }
      }
    }

    this.gameGateway.sendPlayerConnectedGame(connectToGameData.playerNickname, game);

    return game;
  }

  makeTurn(makeTurnData: MakeTurnDto) {
    const player = this.playersService.getPlayer(makeTurnData.playerNickname);
    const game = this.getGameById(makeTurnData.gameId);

    if(game.isFinished) {
      throw new HttpException('The game is already finished', HttpStatus.BAD_REQUEST);
    }

    const playerFieldName = player.id === game.firstPlayer.id ? 'firstVariant' : 'secondVariant'
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

  pauseGame(pauseGameData: PauseGameDto) {
    const game = this.getGameById(pauseGameData.gameId);
    const playerField = pauseGameData.playerNickname === game.firstPlayer.nickname ? 'firstPlayer' : 'secondPlayer'

    if(!game.isFinished) {
      game.isPaused = true;
      game[playerField].isGamePaused = true;

      this.gameGateway.sendPlayerPausedGame(pauseGameData.playerNickname, game);
    }

    return game;
  }

  continueGame(continueGameData: ContinueGameDto) {
    const game = this.getGameById(continueGameData.gameId);
    const playerField = continueGameData.playerNickname === game.firstPlayer.nickname ? 'firstPlayer' : 'secondPlayer'

    game[playerField].isGamePaused = false;

    if (!game.firstPlayer?.isGamePaused && !game.secondPlayer?.isGamePaused) {
      game.isPaused = false;
    }

    this.gameGateway.sendPlayerContinuedGame(continueGameData.playerNickname, game);

    return game;
  }
}
