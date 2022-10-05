export enum Variants {
  Rock = 'Rock',
  Paper = 'Paper',
  Scissors = 'Scissors',
}

export type PlayerVariant = {
  playerNickname: string;
  variant: Variants;
}
