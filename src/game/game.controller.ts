import {Body, Controller, Post, Put} from '@nestjs/common';
import {
  ConnectToGameDto,
  ContinueGameDto,
  CreateNewGameDto,
  MakeTurnDto,
  PauseGameDto
} from "./dto/game.dto";
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

  @Put('pause')
  pauseGame(@Body() pauseGameDto: PauseGameDto) {
    return this.gameService.pauseGame(pauseGameDto);
  }

  @Put('continue')
  continueGame(@Body() continueGameDto: ContinueGameDto) {
    return this.gameService.continueGame(continueGameDto);
  }
}
