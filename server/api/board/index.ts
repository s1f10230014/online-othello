import type { BoardArr, Pos } from '$/repository/boardrepositry';

export type Methods = {
  get: {
    resBody: { board: BoardArr; turnColor: number; me_color: number };
  };
  post: {
    reqBody: Pos;
    resBody: { board: BoardArr };
  };
};
