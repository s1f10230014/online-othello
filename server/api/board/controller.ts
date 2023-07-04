import { boardrepository } from '$/repository/boardrepositry';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: {
      board: boardrepository.getBoard().board,
      turnColor: boardrepository.getBoard().turnColor,
    },
  }),

  post: ({ body, user }) => ({
    status: 201,
    body: { board: boardrepository.clickBoard(body, user.id) },
  }),
}));
