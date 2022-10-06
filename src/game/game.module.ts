import { Module } from '@nestjs/common';
import {GameController} from "./game.controller";
import {GameService} from "./game.service";
import {PlayersModule} from "../players/players.module";
import {GameGateway} from "./websockets/game.gateway";

@Module({
  imports: [PlayersModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
