import type { BoardArr, Pos } from '$/repository/boardrepositry';

export type Methods = {
  get: {
    resBody: { board: BoardArr; count: number[]; turn: number };
  };
  post: { reqBody: Pos; resBody: { board: BoardArr } };
};
