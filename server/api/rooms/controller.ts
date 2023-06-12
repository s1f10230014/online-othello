import { roomRepository } from '$/repository/roomsRepository';
import { roomUsecase } from '$/usecase/roomUsecase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({ status: 200, body: await roomRepository.findLatest() }),

  post: async ({ body, user }) => ({
    status: 201,
    body: await roomUsecase.clickBoard(body.x, body.y, user.id),
  }),
}));
