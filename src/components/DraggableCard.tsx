import { useDraggable } from "@dnd-kit/core";
import { CardData } from "../logic/boardLogic.ts";
import { Card } from "./Card.tsx";

interface DraggableCardProps {
    card: CardData;
}

export function DraggableCard({ card }: DraggableCardProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: card.id,
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            <Card card={card} isDragging={isDragging} />
        </div>
    );
}
