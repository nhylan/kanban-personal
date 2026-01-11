import { describe, it, expect } from 'vitest';
import { moveCard, CardData, addColumn } from './boardLogic.ts';

describe('boardLogic', () => {
    it('should move a card to a new column', () => {
        const initialState: CardData[] = [
            { id: '1', title: 'Task 1', columnTitle: 'To Do' },
            { id: '2', title: 'Task 2', columnTitle: 'Doing' },
        ];

        const newState = moveCard(initialState, '1', 'Doing');

        expect(newState).toEqual([
            { id: '1', title: 'Task 1', columnTitle: 'Doing' },
            { id: '2', title: 'Task 2', columnTitle: 'Doing' },
        ]);
    });

    it('should not change state if card id is not found', () => {
        const initialState: CardData[] = [
            { id: '1', title: 'Task 1', columnTitle: 'To Do' },
        ];

        const newState = moveCard(initialState, 'non-existent', 'Doing');

        expect(newState).toEqual(initialState);
    });

    it('should add a new column', () => {
        const initialColumns = ['To Do', 'Doing'];
        const newColumns = addColumn(initialColumns, 'Done');
        expect(newColumns).toEqual(['To Do', 'Doing', 'Done']);
    });

    it('should not add a duplicate column name', () => {
        const initialColumns = ['To Do'];
        const newColumns = addColumn(initialColumns, 'To Do');
        expect(newColumns).toEqual(['To Do']);
    });
});
