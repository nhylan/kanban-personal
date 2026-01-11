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
});
