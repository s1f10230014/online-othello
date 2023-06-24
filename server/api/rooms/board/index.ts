import type { RoomModel } from '$/commonTypesWithClient/models';
import type { Pos } from '$/usecase/boardUsecase';

export type Methods = {
  post: {
    reqBody: Pos;
    resBody: RoomModel;
  };
};
