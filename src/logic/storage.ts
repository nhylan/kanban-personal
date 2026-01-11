import { LazyStore } from '@tauri-apps/plugin-store';
import { CardData } from './boardLogic.ts';

const STORE_PATH = 'kanban.json';

const isTauri = () => {
    return window !== undefined && (window as any).__TAURI_INTERNALS__ !== undefined;
};
export interface BoardState {
    columns: string[];
    cards: CardData[];
}

const BOARD_KEY = 'kanban-board';

export const loadBoard = async (): Promise<BoardState> => {
    if (!isTauri()) {
        const data = localStorage.getItem(BOARD_KEY);
        return data ? JSON.parse(data) : { columns: ['To Do', 'Doing', 'Done'], cards: [] };
    }

    const store = new LazyStore(STORE_PATH);
    const state = await store.get<BoardState>(BOARD_KEY);
    return state || { columns: ['To Do', 'Doing', 'Done'], cards: [] };
};

export const saveBoard = async (state: BoardState): Promise<void> => {
    if (!isTauri()) {
        localStorage.setItem(BOARD_KEY, JSON.stringify(state));
        return;
    }

    const store = new LazyStore(STORE_PATH);
    await store.set(BOARD_KEY, state);
    await store.save();
};
