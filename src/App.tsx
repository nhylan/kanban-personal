import { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { moveCard, CardData, addColumn } from "./logic/boardLogic.ts";
import { loadBoard, saveBoard, BoardState } from "./logic/storage.ts";
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
  const [boardState, setBoardState] = useState<BoardState>({ columns: [], cards: [] });
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  useEffect(() => {
    loadBoard().then((state) => {
      setBoardState(state);
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveBoard(boardState);
    }
  }, [boardState, isInitialized]);

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleAddCard = (columnTitle: string, title: string) => {
    const newCard: CardData = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      columnTitle,
    };
    setBoardState(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      setBoardState(prev => ({
        ...prev,
        columns: addColumn(prev.columns, newColumnTitle)
      }));
      setNewColumnTitle("");
      setIsAddingColumn(false);
    }
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
      setBoardState(prev => ({
        ...prev,
        cards: moveCard(prev.cards, activeCardId, overColumnTitle)
      }));
    }
  };

  const activeCard = boardState.cards.find((c) => c.id === activeCardId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <main className="container">
        <h1>My Board</h1>
        <div className="board">
          {boardState.columns.map((title) => (
            <Column
              key={title}
              title={title}
              cards={boardState.cards.filter((c) => c.columnTitle === title)}
              onAddCard={(cardTitle) => handleAddCard(title, cardTitle)}
            />
          ))}

          <div className="column add-column-section">
            {isAddingColumn ? (
              <form onSubmit={handleAddColumn} className="add-card-form">
                <input
                  autoFocus
                  className="card-input"
                  placeholder="Column title..."
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onBlur={() => !newColumnTitle && setIsAddingColumn(false)}
                />
              </form>
            ) : (
              <button className="add-column-btn" onClick={() => setIsAddingColumn(true)}>
                + Add Column
              </button>
            )}
          </div>
        </div>
      </main>
      <DragOverlay>
        {activeCard ? <Card card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
