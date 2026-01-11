import { LazyStore } from '@tauri-apps/plugin-store';
import { CardData } from './boardLogic';

const STORE_PATH = 'kanban.json';
const CARDS_KEY = 'cards';


const isTauri = () => {
    return window !== undefined && (window as any).__TAURI_INTERNALS__ !== undefined;
};

export const loadCards = async (): Promise<CardData[]> => {
    if (!isTauri()) {
        const data = localStorage.getItem(CARDS_KEY);
        return data ? JSON.parse(data) : [];
    }

    const store = new LazyStore(STORE_PATH);
    const cards = await store.get<CardData[]>(CARDS_KEY);
    return cards || [];
};

export const saveCards = async (cards: CardData[]): Promise<void> => {
    if (!isTauri()) {
        localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
        return;
    }

    const store = new LazyStore(STORE_PATH);
    await store.set(CARDS_KEY, cards);
    await store.save();
};
