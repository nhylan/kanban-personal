import { useState } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { moveCard, CardData } from "./logic/boardLogic";
import "./App.css";

interface CardProps {
  card: CardData;
  isDragging?: boolean;
  isOverlay?: boolean;
}

function Card({ card, isDragging, isOverlay }: CardProps) {
  const classes = [
    "card",
    isDragging ? "dragging" : "",
    isOverlay ? "overlay" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {card.title}
    </div>
  );
}

interface DraggableCardProps {
  card: CardData;
}

function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Card card={card} isDragging={isDragging} />
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
          <DraggableCard key={card.id} card={card} />
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
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleAddCard = (columnTitle: string, title: string) => {
    const newCard: CardData = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      columnTitle,
    };
    setCards([...cards, newCard]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCardId(null);

    if (over) {
      const activeCardId = active.id as string;
      const overColumnTitle = over.id as string;
      setCards((prevCards) => moveCard(prevCards, activeCardId, overColumnTitle));
    }
  };

  const activeCard = cards.find((c) => c.id === activeCardId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
      <DragOverlay>
        {activeCard ? <Card card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
