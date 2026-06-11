import { eventChannel } from 'redux-saga';
import { call, take, takeLatest, takeEvery, put } from 'redux-saga/effects';
import { io, type Socket } from 'socket.io-client';
import {
  BoardSnapshotPayload,
  CardMovedPayload,
  SocketEvents,
} from '@trello-pro/api-interfaces';
import {
  boardConnectSuccess,
  boardConnectFailure,
  boardSnapshot,
} from './boardSlice';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3200';
let socket: Socket | null = null;

function createSocketChannel(socketInstance: Socket) {
  return eventChannel((emit) => {
    const handler = (payload: BoardSnapshotPayload) => {
      emit(boardSnapshot({ board: payload.board }));
    };

    socketInstance.on(SocketEvents.boardSnapshot, handler);
    socketInstance.on('connect_error', (error: Error) => {
      emit(boardConnectFailure(error.message || 'Socket connection failed'));
    });
    socketInstance.on('error', (error: Error) => {
      emit(boardConnectFailure(error.message || 'Socket error'));
    });

    return () => {
      socketInstance.off(SocketEvents.boardSnapshot, handler);
      socketInstance.off('connect_error');
      socketInstance.off('error');
      socketInstance.disconnect();
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* connectSaga(): any {
  try {
    if (socket && socket.connected) {
      yield put(boardConnectSuccess());
      return;
    }

    socket = io(socketUrl, {
      transports: ['websocket'],
    });

    const channel = yield call(createSocketChannel, socket);

    socket.on('connect', () => {
      socket?.emit(SocketEvents.joinBoard, { boardId: 'board-1' });
    });

    yield put(boardConnectSuccess());

    while (true) {
      const action = yield take(channel);
      yield put(action);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown socket error';
    yield put(boardConnectFailure(message));
  }
}

function cardMoveSaga(action: { type: string; payload: CardMovedPayload }) {
  if (!socket) {
    return;
  }

  socket.emit(SocketEvents.cardMoved, action.payload);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function* boardSaga(): any {
  yield takeLatest('board/boardConnect', connectSaga);
  yield takeEvery('board/cardMove', cardMoveSaga);
}
