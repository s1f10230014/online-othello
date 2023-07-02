import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorRepository } from './userColorRepository';

export type BoardArr = number[][];

export type Pos = { x: number; y: number };

const board: BoardArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 0, 0],
  [0, 0, 7, 2, 1, 0, 0, 0],
  [0, 0, 0, 1, 2, 7, 0, 0],
  [0, 0, 0, 0, 7, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
const directions = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

const turnColor = 1;

//0座標取得(候補地設置に使用)
const get_zero_positions = (board: BoardArr) => {
  const zero_positions: number[][] = [];
  board.map((y, rowIndex_y) => {
    y.map((x, colIndex_x) => {
      if (x === 0) {
        zero_positions.push([rowIndex_y, colIndex_x]);
      }
    });
  });
  return zero_positions;
};

//隣が異色の場合、対ゴマ探し(候補地設置に使用)
const serch_turn_color = (one_zero_position: number[], one_direction: number[]) => {
  const count = 2;
  if (
    board[one_zero_position[0] + one_direction[0] * count]?.[
      one_zero_position[1] + one_direction[1] * count
    ] === turnColor
  ) {
    board[one_zero_position[0]][one_zero_position[1]] = 7;
  }
};

//候補地設置
const Possible_click_positions = () => {
  const zero_positions_list = get_zero_positions(board);

  zero_positions_list.forEach((one_zero_position) => {
    directions.forEach((one_direction) => {
      if (
        board[one_zero_position[0] + one_direction[0]]?.[
          one_zero_position[1] + one_direction[1]
        ] ===
        3 - turnColor
      ) {
        serch_turn_color(one_zero_position, one_direction);
      }
    });
  });
};

//駒設置と、裏返し
const reversi = (y: number, x: number) => {
  if (board[y][x] === 7) {
    board[y][x] = turnColor;
  }
};

export const boardrepository = {
  getBoard: (): BoardArr => board,
  clickBoard: (params: Pos, userId: UserId): BoardArr => {
    if (turnColor === userColorRepository.getUserColor(userId)) {
      Possible_click_positions();
    }
    return board;
  },
};
