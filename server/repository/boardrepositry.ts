import type { UserId } from '$/commonTypesWithClient/branded';
import { userColorRepository } from './userColorRepository';

export type BoardArr = number[][];

export type Pos = { x: number; y: number };

const board: BoardArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 7, 7, 0, 0, 0],
  [0, 0, 7, 2, 1, 7, 0, 0],
  [0, 0, 7, 1, 2, 7, 0, 0],
  [0, 0, 0, 7, 7, 0, 0, 0],
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
//8方向を参照して対駒座標、返し駒座標リストを返す関数
function look_around(x: number, y: number): [number[], number[][]] {
  //確定返し駒リスト※x,yの順番で格納されてる
  let return_piece_list: number[][] = [];
  //クリック座標
  let valid_click_state: number[] = [];
  for (const course of directions) {
    //臨時返し駒リスト※x,yの順番で格納されてる
    const temporary_return_piece_list: number[][] = [];

    //1つ隣が異色駒の場合は、2つ以降の隣コマ参照
    if (
      board[y + course[1]] !== undefined &&
      board[x + course[0]] !== undefined &&
      board[y + course[1]][x + course[0]] === 3 - turnColor
    ) {
      // console.log('隣異色０座標', assume_x, assume_y, course[0], course[1]);
      for (let next_squares = 2; next_squares <= 7; next_squares++) {
        const x_next_squares = course[0] * next_squares + x;
        const y_next_squares = course[1] * next_squares + y;

        //臨時返し駒リストへ格納※pushの順番注意
        temporary_return_piece_list.push([x_next_squares, y_next_squares]);

        if (
          //対駒の前に0が来たらbreak
          board[y_next_squares] !== undefined &&
          board[x_next_squares] !== undefined &&
          board[y_next_squares][x_next_squares] === 0
        ) {
          break;
        }

        if (
          board[y_next_squares] !== undefined &&
          board[x_next_squares] !== undefined &&
          board[y_next_squares][x_next_squares] === turnColor
        ) {
          //対駒がある場合、1つ隣のマスを臨時返し駒リストへ格納
          temporary_return_piece_list.push([x + course[0], y + course[1]]);

          //対駒がある場合、臨時返し駒リストの座標をリストへ
          return_piece_list = return_piece_list.concat(temporary_return_piece_list);

          //対駒が認識された場合、クリック座標を格納※x,yの順で格納
          valid_click_state = [x, y];

          break;
        }
      }
    }
  }
  return [valid_click_state, return_piece_list];
}
const re_yelloy_position = () => {
  //過去の黄色枠座標消去
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[j][i] === 7) {
        board[j][i] = 0;
      }
    }
  }
};
//ゼロ座標全検索
const zero_serch = () => {
  const zero_positions: number[][] = [];
  for (let zy = 0; zy < board.length; zy++) {
    for (let zx = 0; zx < board[zy].length; zx++) {
      if (board[zy][zx] === 0) {
        const f_zero_positions: number[] = [];
        f_zero_positions.push(zx);
        f_zero_positions.push(zy);
        // console.log('f_zero_position', f_zero_positions);
        zero_positions.push(f_zero_positions);
        // console.log('zero_position', zero_positions);
        //注意！zero_positionsは、x,yの順で格納されている
      }
    }
  }
  return zero_positions;
};
const yellow_position = (zero_positions: number[][]) => {
  //0座標から8方向参照、黄色枠位置割り出し処理
  for (const one_zero_position of zero_positions) {
    for (const course of directions) {
      if (
        //0座標の隣が ※異色 の場合処理を行う
        board[one_zero_position[1] + course[1]] !== undefined &&
        board[one_zero_position[0] + course[0]] !== undefined &&
        board[one_zero_position[1] + course[1]][one_zero_position[0] + course[0]] === 3 - turnColor
      ) {
        //2マス目以降対駒探し
        for (let next_squares = 2; next_squares <= 7; next_squares++) {
          const x_next_squares = course[0] * next_squares + one_zero_position[0];
          const y_next_squares = course[1] * next_squares + one_zero_position[1];

          if (
            //対駒の前に0が来たらbreak
            board[y_next_squares] !== undefined &&
            board[x_next_squares] !== undefined &&
            board[y_next_squares][x_next_squares] === 0
          ) {
            break;
          }

          if (
            //対駒在りの場合、0座標を'7'に変更
            board[y_next_squares] !== undefined &&
            board[x_next_squares] !== undefined &&
            board[y_next_squares][x_next_squares] === turnColor
          ) {
            console.log('有効ゼロ座標', one_zero_position[0], one_zero_position[1]);
            board[one_zero_position[1]][one_zero_position[0]] = 7;

            break;
          }
        }
      }
    }
  }
};
const turn = (click: number[], return_list: number[][]) => {
  if (
    board[click[1]] !== undefined &&
    board[click[0]] !== undefined &&
    board[click[1]][click[0]] === 0
  ) {
    board[click[1]][click[0]] = turnColor;

    for (const one_return_list of return_list) {
      board[one_return_list[1]][one_return_list[0]] = turnColor;
    }

    turnColor = 3 - turnColor;
  }
};
export const boardrepository = {
  getBoard: (): BoardArr => board,
  clickBoard: (params: Pos, userId: UserId): BoardArr => {
    if (turnColor === userColorRepository.getUserColor(userId)) {
      re_yelloy_position();
      //有効クリック駒設置、駒返し処理
      const [click, return_list] = look_around(params.x, params.y);
      // console.log('return_list', return_list, return_list[0], return_list[1]);
      turn(click, return_list);
      const zero_list = zero_serch();
      yellow_position(zero_list);
    }
    return board;
  },
};
