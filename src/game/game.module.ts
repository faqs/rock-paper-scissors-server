import { Module } from '@nestjs/common';
import {GameController} from "./game.controller";
import {GameService} from "./game.service";
import {PlayersModule} from "../players/players.module";

@Module({
  imports: [PlayersModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
