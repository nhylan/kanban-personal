import { describe, it, expect } from 'vitest';
import { saveBoard, loadBoard, BoardState } from './storage.ts';

describe('storage', () => {
    it('should load default state if nothing is stored', async () => {
        const state = await loadBoard();
        expect(state.columns).toEqual(['To Do', 'Doing', 'Done']);
        expect(state.cards).toEqual([]);
    });

    it('should save and then load board state', async () => {
        const mockState: BoardState = {
            columns: ['Unique'],
            cards: [{ id: '1', title: 'Test', columnTitle: 'Unique' }]
        };

        await saveBoard(mockState);
        const loadedState = await loadBoard();

        expect(loadedState).toEqual(mockState);
    });
});
