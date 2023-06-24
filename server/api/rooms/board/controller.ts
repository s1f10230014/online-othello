import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  //kt
  post: async ({ body, user }) => ({
    status: 201,
    body: await roomUsecase.clickBoard(body.x, body.y, user.id),
  }),
}));
