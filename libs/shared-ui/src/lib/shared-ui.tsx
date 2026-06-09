import type { Board, Column, Card } from '@trello-pro/api-interfaces';

function CardTitle({ card }: { card: Card }) {
  return (
    <article className="rounded border border-slate-300 bg-white p-3 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
      {card.description ? (
        <p className="mt-2 text-xs text-slate-600">{card.description}</p>
      ) : null}
    </article>
  );
}

function ColumnCard({ column, cardMap }: { column: Column; cardMap: Record<string, Card> }) {
  return (
    <section className="min-w-[260px] rounded-xl bg-slate-100 p-4 shadow-sm">
      <header className="mb-3 border-b border-slate-300 pb-3">
        <h2 className="text-base font-semibold text-slate-900">{column.title}</h2>
        <p className="text-xs text-slate-500">{column.cardIds.length} cards</p>
      </header>
      <div className="space-y-3">
        {column.cardIds.map((cardId) => {
          const card = cardMap[cardId];
          if (!card) return null;
          return <CardTitle key={card.id} card={card} />;
        })}
      </div>
    </section>
  );
}

export function BoardCanvas({ board }: { board: Board }) {
  const cardMap: Record<string, Card> = board.cards.reduce(
    (acc, card) => ({ ...acc, [card.id]: card }),
    {}
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <header className="mb-6 rounded-3xl bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-slate-900">{board.title}</h1>
        {board.description ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">{board.description}</p>
        ) : null}
      </header>

      <section className="grid auto-cols-fr gap-4 overflow-x-auto pb-6 lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {board.columnOrder.map((columnId) => {
          const column = board.columns.find((item) => item.id === columnId);
          if (!column) return null;
          return <ColumnCard key={column.id} column={column} cardMap={cardMap} />;
        })}
      </section>
    </main>
  );
}

export default BoardCanvas;
