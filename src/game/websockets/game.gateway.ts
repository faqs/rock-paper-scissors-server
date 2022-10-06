import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {RoundResult} from "../interfaces/game.interface";

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer() server: Server;

  sendRoundResult(result: RoundResult) {
    this.server.emit('roundResult', result);
  }
}
