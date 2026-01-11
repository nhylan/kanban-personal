import { CardData } from "../logic/boardLogic.ts";

interface CardProps {
    card: CardData;
    isDragging?: boolean;
    isOverlay?: boolean;
}

export function Card({ card, isDragging, isOverlay }: CardProps) {
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
