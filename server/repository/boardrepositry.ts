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
const get_zero_positions = () => {
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
//過去の黄色枠座標消去
const remove_yellow = () => {
  board.forEach((row, rowIndex) =>
    row.forEach((cell, cellIndex) => {
      if (cell === 7) {
        board[rowIndex][cellIndex] = 0;
      }
    })
  );
};
//隣が異色の場合、対ゴマ探しor候補地選出
//ここの複雑度下げる
const serch_turn_color = (
  a_position: number[],
  one_direction: number[],
  count: number,
  select: number,
  reversi_positions: number[][],
  temporary_reversi_positions: number[][]
) => {
  if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    turnColor
  ) {
    temporary_reversi_positions.push([
      a_position[0] + one_direction[0],
      a_position[1] + one_direction[1],
    ]);
    select === 0 && (board[a_position[0]][a_position[1]] = 7);
    reversi_positions.push(...temporary_reversi_positions);
    return reversi_positions;
  } else if (
    board[a_position[0] + one_direction[0] * count]?.[a_position[1] + one_direction[1] * count] ===
    3 - turnColor
  ) {
    temporary_reversi_positions.push([
      a_position[0] + one_direction[0] * count,
      a_position[1] + one_direction[1] * count,
    ]);
    count++;
    serch_turn_color(
      a_position,
      one_direction,
      count,
      select,
      reversi_positions,
      temporary_reversi_positions
    );
  }
  temporary_reversi_positions = [];
};
//8方向参照
//ここの複雑度下げる
const Possible_click_positions = (positions: number[][], select: number): number[][] => {
  let result: number[][] | undefined = undefined;
  let reversi_positions: number[][] = [];
  const temporary_reversi_positions: number[][] = [];

  positions.forEach((a_position) => {
    directions.forEach((one_direction) => {
      if (
        board[a_position[0] + one_direction[0]]?.[a_position[1] + one_direction[1]] ===
        3 - turnColor
      ) {
        result = serch_turn_color(
          a_position,
          one_direction,
          2,
          select,
          reversi_positions,
          temporary_reversi_positions
        );
        result && (reversi_positions = result);
      }
    });
  });
  // タイゴマの位置を返す
  return reversi_positions;
};
//駒設置と裏返し処理
const othello = (y: number, x: number) => {
  if (board[y][x] === 7) {
    board[y][x] = turnColor;
    const reversi_positions: number[][] = Possible_click_positions([[y, x]], 1);
    reversi_positions.forEach((n) => {
      board[n[0]][n[1]] = turnColor;
    });

    turnColor = 3 - turnColor;
  }
};
export const boardrepository = {
  getBoard: () => {
    count[0] = board.flat().filter((n) => n === 2).length;
    count[1] = board.flat().filter((n) => n === 1).length;

    return { exBoard: board, exCount: count, exTurn: turn };
  },

  getBoard: (): BoardArr => board,
  clickBoard: (params: Pos, userId: UserId): BoardArr => {
    if (turnColor === userColorRepository.getUserColor(userId)) {
      othello(params.y, params.x);
      remove_yellow();
      Possible_click_positions(get_zero_positions(), 0);
    }
    return board;
  },
};
