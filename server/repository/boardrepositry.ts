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

//0座標取得
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

//隣が異色の場合、対ゴマ探し
const serch_turn_color = (
  one_zero_position: number[],
  one_direction: number[],
  temporary_return_list: number[][]
) => {
  const count = 2;
  if (
    board[one_zero_position[0] + one_direction[0] * count]?.[
      one_zero_position[1] + one_direction[1] * count
    ] === turnColor
  ) {
    board[one_zero_position[0]][one_zero_position[1]] = 7;
    const return_list: number[][] = temporary_return_list;
    return_list[String(one_zero_position)];
  }
};

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
        const temporary_return_list: number[][] = [
          [one_zero_position[0] + one_direction[0], one_zero_position[1] + one_direction[1]],
        ];
      }
    });
  });
};

export const boardrepository = {
  getBoard: (): BoardArr => board,
  clickBoard: (params: Pos, userId: UserId): BoardArr => {
    if (turnColor === userColorRepository.getUserColor(userId)) {
      re_yelloy_position();
      //有効クリック駒設置、駒返し処理
      const [click, return_list] = look_around(params.x, params.y);
      turn(click, return_list);
      const zero_list = zero_serch();
      yellow_position(zero_list);
    }
    return board;
  },
};
