import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CardData } from "../logic/boardLogic.ts";
import { DraggableCard } from "./DraggableCard.tsx";

interface ColumnProps {
    title: string;
    cards: CardData[];
    onAddCard: (title: string) => void;
}

export function Column({ title, cards, onAddCard }: ColumnProps) {
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
