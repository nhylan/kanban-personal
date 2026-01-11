import { describe, it, expect, vi } from 'vitest';
import { saveCards, loadCards } from './storage';
import { CardData } from './boardLogic';

describe('storage', () => {
    it('should load an empty array if no cards are stored', async () => {
        const cards = await loadCards();
        expect(cards).toEqual([]);
    });

    it('should save and then load cards', async () => {
        const mockCards: CardData[] = [
            { id: '1', title: 'Test', columnTitle: 'To Do' }
        ];

        await saveCards(mockCards);
        const loadedCards = await loadCards();

        expect(loadedCards).toEqual(mockCards);
    });
});
