import { test, expect } from '@playwright/test';

test('shows a board with default columns', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'My Board' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Doing' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Done' })).toBeVisible();
});
