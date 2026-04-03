import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:4200/");
});

test("navigate to form page", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm.navigateTo().DatePickerPage();
  await pm.navigateTo().smartTablePage();
  await pm.navigateTo().toastrPage();
  await pm.navigateTo().tooltipPage();
});

test("parametrized methods", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.navigateTo().formLayoutsPage();
  await pm
    .onFormLayoutsPage()
    .submitUsingTheGridFormWithCredentialsAndSelectOption(
      "tesdt@test.com",
      "Welcome1",
      "Option 2",
    );
  await pm
    .onFormLayoutsPage()
    .submitInlineFormWithNameEmailAndCheckbox(
      "John Smith",
      "John@test.com",
      false,
    );
  await pm.navigateTo().DatePickerPage();
  await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10);
  await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 10);
});

// Old code before Page Object Model refactor — each test manually imported and
// instantiated individual page objects instead of using a centralized PageManager.

// import { test, expect } from "@playwright/test";
// import { NavigationPage } from "../page-objects/navigationPage";
// import { FormLayoutsPage } from "../page-objects/formLayoutsPage";
// import { DatePickerPage } from "../page-objects/DatePickerPage";

// test.beforeEach(async ({ page }) => {
//   await page.goto("http://localhost:4200/");
// });

// test("navigate to all pages", async ({ page }) => {
//   const navigateTo = new NavigationPage(page);
//   await navigateTo.formLayoutsPage();
//   await navigateTo.DatePickerPage();
//   await navigateTo.smartTablePage();
//   await navigateTo.toastrPage();
//   await navigateTo.tooltipPage();
// });

// test("parametrized methods", async ({ page }) => {
//   const navigateTo = new NavigationPage(page);
//   const onFormLayoutsPage = new FormLayoutsPage(page);
//   const onDatePickerPage = new DatePickerPage(page);

//   await navigateTo.formLayoutsPage();
//   await onFormLayoutsPage.submitUsingTheFormGridFormWithCredentialsAndSelectOption(
//     "test@test.com",
//     "Welcome1",
//     "Option 1",
//   );
//   await onFormLayoutsPage.submitInLineFormWithNameEmailAndCheckbox(
//     "John Smith",
//     "John@test.com",
//     true,
//   );
//   await navigateTo.DatePickerPage();
//   await onDatePickerPage.selectCommonDatePickerDateFromToday(10);
//   await onDatePickerPage.selectDatePickerWithRangeFromToday(5, 15);
// });
