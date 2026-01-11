import { useState } from "react";
import "./App.css";

interface Card {
  id: string;
  title: string;
  columnTitle: string;
}

interface ColumnProps {
  title: string;
  cards: Card[];
  onAddCard: (title: string) => void;
}

function Column({ title, cards, onAddCard }: ColumnProps) {
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
    <section className="column">
      <h2>{title}</h2>
      <div className="card-list">
        {cards.map((card) => (
          <div key={card.id} className="card">
            {card.title}
          </div>
        ))}
      </div>
      {isAdding ? (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
        </form>
      ) : (
        <button onClick={() => setIsAdding(true)}>Add Card</button>
      )}
    </section>
  );
}

function App() {
  const columns = ["To Do", "Doing", "Done"];
  const [cards, setCards] = useState<Card[]>([]);

  const handleAddCard = (columnTitle: string, title: string) => {
    const newCard: Card = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      columnTitle,
    };
    setCards([...cards, newCard]);
  };

  return (
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
  );
}

export default App;
