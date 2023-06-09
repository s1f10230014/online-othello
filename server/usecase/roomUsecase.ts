import type { UserId } from '$/commonTypesWithClient/branded';
import type { RoomModel } from '$/commonTypesWithClient/models';
import { roomRepository } from '$/repository/roomsRepository';
import { roomIdParser } from '$/service/idParsers';
import assert from 'assert';
import { randomUUID } from 'crypto';
import { userColorUsecase } from './userColorUsecase';

const initBoard = () => [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

export const roomUsecase = {
  create: async (): Promise<RoomModel> => {
    const newRoom: RoomModel = {
      //ほとんど衝突しない
      id: roomIdParser.parse(randomUUID()),
      //初期は、関数で
      board: initBoard(),
      status: 'waiting',
      created: Date.now(),
    };
    await roomRepository.save(newRoom);

    return newRoom;
  },

  clickBoard: async (x: number, y: number, userId: UserId): Promise<RoomModel> => {
    const latest = await roomRepository.findLatest();

    //ありえないときのassert
    assert(latest, 'ありえないよ');

    const newBoard: number[][] = JSON.parse(JSON.stringify(latest.board));
    newBoard[y][x] = userColorUsecase.getUserColor(userId);

    const newRoom: RoomModel = { ...latest, board: newBoard };

    await roomRepository.save(newRoom);

    return newRoom;
  },
};
