import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Board, CardMovedPayload } from '@trello-pro/api-interfaces';

export interface BoardState {
  board: Board | null;
  status: 'idle' | 'connecting' | 'ready' | 'error';
  error: string | null;
}

const initialState: BoardState = {
  board: null,
  status: 'idle',
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    boardConnect: (state) => {
      state.status = 'connecting';
      state.error = null;
    },
    boardConnectSuccess: (state) => {
      state.status = 'ready';
      state.error = null;
    },
    boardConnectFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error';
      state.error = action.payload;
    },
    boardSnapshot: (state, action: PayloadAction<{ board: Board }>) => {
      state.board = action.payload.board;
      state.status = 'ready';
      state.error = null;
    },
    cardMove: (state, action: PayloadAction<CardMovedPayload>) => {
      // Saga handles the socket emission; reducer just serves as action type
      // Actual board state update comes from boardSnapshot
    },
  },
});

export const { boardConnect, boardConnectSuccess, boardConnectFailure, boardSnapshot, cardMove } =
  boardSlice.actions;

export const boardReducer = boardSlice.reducer;
