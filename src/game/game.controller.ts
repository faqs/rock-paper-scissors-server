import {Body, Controller, Post, Put} from '@nestjs/common';
import {ConnectToGameDto, CreateNewGameDto, MakeTurnDto} from "./dto/game.dto";
import {GameService} from "./game.service";

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Post()
  createNewGame(@Body() createNewGameDto: CreateNewGameDto) {
    return this.gameService.createNewGame(createNewGameDto);
  }

  @Put()
  connectToGame(@Body() connectToGameDto: ConnectToGameDto) {
    return this.gameService.connectToGame(connectToGameDto);
  }

  @Put('makeTurn')
  makeTurn(@Body() makeTurnDto: MakeTurnDto) {
    return this.gameService.makeTurn(makeTurnDto);
  }
}
