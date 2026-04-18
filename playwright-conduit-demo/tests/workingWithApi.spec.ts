import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json';

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async (route) => {
    console.log('TAGS INTERCEPTED');
    await route.fulfill({
      body: JSON.stringify(tags)
    });
  });
  await page.goto('https://conduit.bondaracademy.com/');
});

test('mock tags', async ({ page }) => {
  await expect(page.locator('.tag-list .tag-default').first()).toHaveText('automation');
});

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = 'This is a MOCK test title';
    responseBody.articles[0].description = 'This is a MOCK test description';
    await route.fulfill({
      body: JSON.stringify(responseBody)
    });
  });

  await page.getByText('Global Feed').click();
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await page.pause();
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description');
});

test('delete article', async ({ page, request }) => {
  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      article: {
        title: 'Test Title',
        description: 'Test description',
        body: 'Test article.',
        tagList: []
      }
    }
  });
  await page.getByText('Global Feed').click();
  await page.getByText('Test Title').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  expect(articleResponse.status()).toBe(201);
  await page.getByText('Global Feed').click();
  await expect(page.getByText('Test Title')).toHaveCount(0);
});

test('create article', async ({ page, request }) => {
  await page.getByText('New Article').click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome');
  await page.getByRole('textbox', { name: "What\'s this article about?" }).fill('About the Playwright');
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('This is a test article created using Playwright.');
  await page.getByRole('button', { name: 'Publish Article' }).click();

  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/');
  const articleResponseBody = await articleResponse.json();
  const SlugId = articleResponseBody.article.slug;

  await expect(page.locator('app-article-page h1')).toHaveText('Playwright is awesome');
  await page.getByText('Home').click();
  await page.getByText('Global Feed').click();
  await expect(page.getByText('Playwright is awesome')).toHaveCount(1);
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByText('Global Feed').click();
  await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome');

  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${SlugId}`, {});
  expect(deleteArticleResponse.status()).toBe(204);
});
