export interface CardData {
    id: string;
    title: string;
    columnTitle: string;
}

export const moveCard = (cards: CardData[], activeId: string, overColumnTitle: string): CardData[] => {
    return cards.map((card) =>
        card.id === activeId
            ? { ...card, columnTitle: overColumnTitle }
            : card
    );
};

export const addColumn = (columns: string[], title: string): string[] => {
    if (columns.includes(title)) {
        return columns;
    }
    return [...columns, title];
};
