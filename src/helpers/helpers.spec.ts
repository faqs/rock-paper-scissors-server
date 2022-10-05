import {getGameWinner, getRoundWinner} from './helpers';
import {Variants} from "../commonTypes";

describe('Helpers', () => {
  it('check getRoundWinner helper', () => {
    const testData = {
      firstVariant: {
        playerNickname: 'player1',
        variant: Variants.Rock,
      },
      secondVariant: {
        playerNickname: 'player2',
        variant: Variants.Scissors,
      }
    }

    expect(getRoundWinner(testData.firstVariant, testData.secondVariant)).toBe('player1');
  })
});

describe('check getGameWinner helper', () => {
  it('test 1', () => {
    const testData = [{
      firstVariant: {
        playerNickname: 'player1',
        variant: Variants.Rock,
      },
      secondVariant: {
        playerNickname: 'player2',
        variant: Variants.Scissors,
      }
    }, {
      firstVariant: {
        playerNickname: 'player1',
        variant: Variants.Paper,
      },
      secondVariant: {
        playerNickname: 'player2',
        variant: Variants.Scissors,
      }
    }, {
      firstVariant: {
        playerNickname: 'player1',
        variant: Variants.Paper,
      },
      secondVariant: {
        playerNickname: 'player2',
        variant: Variants.Rock,
      }
    }];

    expect(getGameWinner(testData)).toBe('player1');
  })

  it('test 2', () => {
    const testData = [{
      secondVariant: {playerNickname: "p2", variant: Variants.Rock},
      firstVariant: {playerNickname: "p1", variant: Variants.Paper}
    }, {
      secondVariant: {playerNickname: "p2", variant: Variants.Scissors},
      firstVariant: {playerNickname: "p1", variant: Variants.Scissors}
    }, {
      secondVariant: {playerNickname: "p2", variant: Variants.Rock},
      firstVariant: {playerNickname: "p1", variant: Variants.Rock}
    }];

    expect(getGameWinner(testData)).toBe('p1');
  })
});
