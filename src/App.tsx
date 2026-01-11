import { useState } from "react";
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
  return <div className="card">{card.title}</div>;
}

interface ColumnProps {
  title: string;
  cards: CardData[];
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
