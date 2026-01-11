import { test, expect } from '@playwright/test';

test.describe('Kanban Board', () => {
    test('shows a board with default columns', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('heading', { name: 'My Board' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Doing' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
    });

    test('can add a card to the To Do column', async ({ page }) => {
        await page.goto('/');

        const toDoColumn = page.locator('section').filter({ hasText: 'To Do' });
        const addButton = toDoColumn.getByRole('button', { name: 'Add Card' });

        await addButton.click();
        const input = toDoColumn.getByPlaceholder('Card title...');
        await input.fill('First Task');
        await page.keyboard.press('Enter');

        await expect(toDoColumn.getByText('First Task')).toBeVisible();
    });

    test('can drag a card from To Do to Doing', async ({ page }) => {
        await page.goto('/');

        // Add a card first
        const toDoColumn = page.locator('section').filter({ hasText: 'To Do' });
        const addButton = toDoColumn.getByRole('button', { name: 'Add Card' });
        await addButton.click();
        const input = toDoColumn.getByPlaceholder('Card title...');
        await input.fill('Drag Me');
        await page.keyboard.press('Enter');

        const card = page.getByText('Drag Me');
        const doingColumn = page.locator('section').filter({ hasText: 'Doing' });

        // Native drag and drop in Playwright
        await card.dragTo(doingColumn);

        await expect(doingColumn.getByText('Drag Me')).toBeVisible();
        await expect(toDoColumn.getByText('Drag Me')).not.toBeVisible();
    });

    test('cards persist after reload', async ({ page }) => {
        await page.goto('/');

        const toDoColumn = page.locator('section').filter({ hasText: 'To Do' });
        const addButton = toDoColumn.getByText('+ Add Card');

        await addButton.click();
        const input = toDoColumn.getByPlaceholder('Card title...');
        await input.fill('Stay with me');
        await page.keyboard.press('Enter');

        await expect(toDoColumn.getByText('Stay with me')).toBeVisible();

        // Reload the page
        await page.reload();

        // Verify the card is still there
        await expect(page.getByText('Stay with me')).toBeVisible();
    });
});
