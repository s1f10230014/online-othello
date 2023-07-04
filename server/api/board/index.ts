import type { BoardArr, Pos } from '$/repository/boardrepositry';

export type Methods = {
  get: {
    resBody: { board: BoardArr; turnColor: number };
  };
  post: {
    reqBody: Pos;
    resBody: { board: BoardArr };
  };
};
