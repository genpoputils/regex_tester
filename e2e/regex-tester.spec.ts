import { test, expect } from '@playwright/test';

test.describe('Regex Tester Pro E2E Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with hero, title, and buttons', async ({ page }) => {
    await expect(page).toHaveTitle(/Regex Tester Pro/);
    await expect(page.locator('h1')).toContainText('Regex');
    await expect(page.locator('h1')).toContainText('Tester');
    await expect(page.getByRole('button', { name: 'Start Testing' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Regex Cheat Sheet' }).first()).toBeVisible();
  });

  test('should evaluate default pattern and show match results', async ({ page }) => {
    // Check that matches table or match results rendered
    const matchesHeader = page.locator('text=Matches');
    await expect(matchesHeader).toBeVisible();

    // Check that at least 1 match exists
    const matchBadges = page.locator('tbody tr');
    await expect(matchBadges.first()).toBeVisible();
  });

  test('should toggle flags and update summary badge', async ({ page }) => {
    // Click Ignore Case flag button 'i'
    const ignoreCaseBtn = page.getByRole('button', { name: 'i Ignore Case' });
    await ignoreCaseBtn.click();

    // Flag summary should now contain 'i'
    const flagSummary = page.locator('text=flags:').locator('..');
    await expect(flagSummary).toContainText('i');
  });

  test('should switch result views between Table, JSON, and Raw', async ({ page }) => {
    // Switch to JSON view
    await page.getByRole('button', { name: 'JSON' }).click();
    await expect(page.locator('pre code')).toBeVisible();

    // Switch to Raw view
    await page.getByRole('button', { name: 'Raw' }).click();
    await expect(page.locator('div.font-mono.text-xs')).toBeVisible();

    // Switch back to Table view
    await page.getByRole('button', { name: 'Table' }).click();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should open presets modal and apply a preset', async ({ page }) => {
    // Click Presets navbar button
    await page.getByRole('button', { name: 'Presets' }).first().click();

    // Modal dialog should be visible
    const modalTitle = page.locator('#preset-modal-title');
    await expect(modalTitle).toBeVisible();

    // Find and apply Indian PAN preset
    const panCard = page.locator('text=Indian PAN Card').locator('..').locator('..');
    await panCard.getByRole('button', { name: 'Use Preset' }).click();

    // Pattern input should now contain PAN regex
    const input = page.locator('input[aria-label="Regular Expression Pattern"]');
    await expect(input).toHaveValue('[A-Z]{5}[0-9]{4}[A-Z]{1}');
  });

  test('should navigate to cheat sheet page', async ({ page }) => {
    await page.getByRole('link', { name: 'Cheat Sheet' }).first().click();
    await expect(page).toHaveURL(/\/cheat-sheet/);
    await expect(page.locator('h1')).toContainText('Cheat Sheet');
  });

  test('should open cheat sheet drawer from shortcut or button', async ({ page }) => {
    // Open Cheat Sheet drawer via navbar button
    const drawerBtn = page.getByRole('button', { name: 'Cheat Sheet' }).first();
    await drawerBtn.click();
    await expect(page.locator('#cheat-drawer-title')).toBeVisible();

    // Close cheat sheet drawer
    const closeBtn = page.getByRole('button', { name: 'Close cheat sheet' });
    await closeBtn.click();
    await expect(page.locator('#cheat-drawer-title')).not.toBeVisible();
  });

  test('should transform between day and night modes', async ({ page }) => {
    const html = page.locator('html');

    // Click Day mode (Light)
    const dayBtn = page.getByRole('button', { name: 'Switch to Day Mode' });
    await dayBtn.click();
    await expect(html).not.toHaveClass(/dark/);
    await expect(html).toHaveClass(/light/);

    // Click Night mode (Dark)
    const nightBtn = page.getByRole('button', { name: 'Switch to Night Mode' });
    await nightBtn.click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/light/);
  });
});
