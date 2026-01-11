import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { moveCard, CardData, addColumn } from "./logic/boardLogic.ts";
import { loadBoard, saveBoard, BoardState } from "./logic/storage.ts";
import { Card } from "./components/Card.tsx";
import { Column } from "./components/Column.tsx";
import "./App.css";

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
