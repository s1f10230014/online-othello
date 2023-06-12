import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorUsecase } from './userColorUsecase';

export type BoardArr = number[][];

export type Pos = { x: number; y: number };

const board: BoardArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const boardrepository = {
  getBoard: (): BoardArr => board,
  clickBoard: (params: Pos, UserId: UserId): BoardArr => {
    userColorUsecase.getUserColor(UserId);
    board[params.y][params.x] = userColorUsecase.getUserColor(UserId);
    return board;
  },
};
