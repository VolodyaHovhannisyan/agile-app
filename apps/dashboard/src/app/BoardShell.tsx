'use client';

import { useEffect } from 'react';
import { BoardCanvas } from '@trello-pro/shared-ui';
import { boardConnect, cardMove } from '../store/boardSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function BoardShell() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.board);
  const status = useAppSelector((state) => state.board.status);
  const error = useAppSelector((state) => state.board.error);

  useEffect(() => {
    dispatch(boardConnect());
  }, [dispatch]);

  const moveFirstCard = () => {
    if (!board || board.columnOrder.length < 2) {
      return;
    }

    const fromColumn = board.columns.find((item) => item.id === board.columnOrder[0]);
    const toColumn = board.columns.find((item) => item.id === board.columnOrder[1]);
    if (!fromColumn || !toColumn || fromColumn.cardIds.length === 0) {
      return;
    }

    const cardId = fromColumn.cardIds[0];

    dispatch(
      cardMove({
        boardId: board.id,
        cardId,
        fromColumnId: fromColumn.id,
        toColumnId: toColumn.id,
        toIndex: 0,
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Real-time Board</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              A simple socket-backed board powered by Redux and saga-driven events.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={moveFirstCard}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!board || board.columnOrder.length < 2}
            >
              Move first card
            </button>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
              {status === 'connecting' && 'Connecting...'}
              {status === 'ready' && 'Connected'}
              {status === 'error' && `Error: ${error ?? 'Unknown'}`}
              {status === 'idle' && 'Waiting...'}
            </span>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          {board ? (
            <BoardCanvas board={board} />
          ) : (
            <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-600">
              {status === 'connecting' ? 'Connecting to the board...' : 'Waiting for board data from the socket server.'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
