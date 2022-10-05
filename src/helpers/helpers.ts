import {Variants, PlayerVariant} from "../commonTypes";
import {Round} from "../game/interfaces/game.interface";

export function getRoundWinner(firstPlayerData: PlayerVariant, secondPlayerData: PlayerVariant):string {
  const firstPlayerNickname = firstPlayerData.playerNickname;
  const secondPlayerNickname = secondPlayerData.playerNickname;
  const firstPlayerVariant = firstPlayerData.variant;
  const secondPlayerVariant = secondPlayerData.variant;

  if(firstPlayerVariant === secondPlayerVariant) {
    return 'Draw';
  }

  if(firstPlayerVariant === Variants.Rock) {
    return secondPlayerVariant === Variants.Scissors ? firstPlayerNickname : secondPlayerNickname;
  }

  if(firstPlayerVariant === Variants.Scissors) {
    return secondPlayerVariant === Variants.Rock ? secondPlayerNickname : firstPlayerNickname;
  }

  if(firstPlayerVariant === Variants.Paper) {
    return secondPlayerVariant === Variants.Scissors ? secondPlayerNickname : firstPlayerNickname;
  }
}

export function getGameWinner(rounds: Round[]): string {
  if(!rounds || rounds.length === 0) {
    throw new Error('Nothing to count');
  }

  const roundsWinners = rounds.map(round => getRoundWinner(round.firstVariant, round.secondVariant));
  const firstPlayer = rounds[0].firstVariant.playerNickname;
  const secondPlayer = rounds[0].secondVariant.playerNickname;
  let firstPlayerWins = roundsWinners.filter(winner => winner === firstPlayer).length;
  let secondPlayerWins = roundsWinners.filter(winner => winner === secondPlayer).length;

  if(firstPlayerWins === secondPlayerWins) {
    return 'Draw';
  }

  return firstPlayerWins > secondPlayerWins ? firstPlayer : secondPlayer;
}
