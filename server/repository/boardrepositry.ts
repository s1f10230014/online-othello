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
let turnColor = 1;
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
//隣が異色の場合、対ゴマ探しor候補地選出
const serch_turn_color = (a_position: number[], one_direction: number[], count: number) => {
  if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    turnColor
  ) {
    const yellow_position: number[] = [a_position[0], a_position[1]];
    const taigoma_positions: number[] = [
      a_position[0] + one_direction[0] * count,
      a_position[1] + one_direction[1] * count,
    ];
    return { yellow_position, taigoma_positions };
  } else if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    3 - turnColor
  ) {
    count++;
    serch_turn_color(a_position, one_direction, count);
  }
};

//8方向参照
const Possible_click_positions = (positions: number[][]) => {
  let result: { yellow_position: number[]; taigoma_positions: number[] } | undefined = undefined;
  const yellow_positions: number[][] = [];
  const taigoma_positions: number[][] = [];
  positions.forEach((a_position) => {
    directions.forEach((one_direction) => {
      if (
        board[a_position[0] + one_direction[0]]?.[a_position[1] + one_direction[1]] ===
        3 - turnColor
      ) {
        result = serch_turn_color(a_position, one_direction, 2);
        result && yellow_positions.push(result.yellow_position);
        result && taigoma_positions.push(result.taigoma_positions);
        return { yellow_positions, taigoma_positions };
      }
    });
  });
};
//裏返し処理
const reversi = (y: number, x: number, taigoma_y: number, taigoma_x: number) => {
  //ここにkyeで割りあてた対ゴマの位置リストから返す駒位置を計算し裏返す処理を書く
};
//駒設置と裏返し処理
const othello = (y: number, x: number) => {
  if (board[y][x] === 7) {
    board[y][x] = turnColor;
    //ここで、reversi関数を呼び出す
    turnColor = 3 - turnColor;
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
