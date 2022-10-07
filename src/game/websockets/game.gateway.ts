import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {Game, RoundResult} from "../interfaces/game.interface";

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer() server: Server;

  sendRoundResult(result: RoundResult) {
    this.server.emit('roundResult', result);
  }

  sendPlayerPausedGame(playerNickname: string, game: Game) {
    this.server.emit('gamePaused', {
      playerNickname,
      game,
    });
  }

  sendPlayerContinuedGame(playerNickname: string, game: Game) {
    this.server.emit('gameContinued', {
      playerNickname,
      game,
    });
  }
}
