import { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core";
import "./App.css";

interface CardData {
  id: string;
  title: string;
  columnTitle: string;
}

interface CardProps {
  card: CardData;
}

function Card({ card }: CardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="card"
    >
      {card.title}
    </div>
  );
}

interface ColumnProps {
  title: string;
  cards: CardData[];
  onAddCard: (title: string) => void;
}

function Column({ title, cards, onAddCard }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: title,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle);
      setNewCardTitle("");
      setIsAdding(false);
    }
  };

  return (
    <section ref={setNodeRef} className="column">
      <h2>{title}</h2>
      <div className="card-list">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      {isAdding ? (
        <form onSubmit={handleSubmit} className="add-card-form">
          <input
            autoFocus
            className="card-input"
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onBlur={() => !newCardTitle && setIsAdding(false)}
          />
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setIsAdding(true)}>
          + Add Card
        </button>
      )}
    </section>
  );
}

function App() {
  const columns = ["To Do", "Doing", "Done"];
  const [cards, setCards] = useState<CardData[]>([]);

  const handleAddCard = (columnTitle: string, title: string) => {
    const newCard: CardData = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      columnTitle,
    };
    setCards([...cards, newCard]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeCardId = active.id as string;
      const overColumnTitle = over.id as string;

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === activeCardId
            ? { ...card, columnTitle: overColumnTitle }
            : card
        )
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="container">
        <h1>My Board</h1>
        <div className="board">
          {columns.map((title) => (
            <Column
              key={title}
              title={title}
              cards={cards.filter((c) => c.columnTitle === title)}
              onAddCard={(cardTitle) => handleAddCard(title, cardTitle)}
            />
          ))}
        </div>
      </main>
    </DndContext>
  );
}

export default App;
