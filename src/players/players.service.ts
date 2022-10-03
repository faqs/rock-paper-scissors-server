import { Injectable } from '@nestjs/common';
import {Player} from './interfaces/players.interface';

@Injectable()
export class PlayersService {
  private readonly players: Player[] = [];

  createNewPlayer(nickname: string): Player {
    const newPlayer = {
      id: this.players.length + 1,
      nickname: nickname,
    }

    this.players.push(newPlayer);

    return newPlayer;
  }

  getPlayer(nickname: string) {
    return this.players.find(player => player.nickname === nickname);
  }
}
