import {WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer() server: Server;

  sendRoundResult(result) {
    this.server.emit('roundResult', result);
  }
}
