import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase {
  constructor(page: Page) {
    super(page);
  }

  async formLayoutsPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("Form Layouts").click();
    await this.waitForNumberOfSeconds(2);
  }

  async DatePickerPage() {
    await this.selectGroupMenuItem("Forms");
    await this.page.getByText("DatePicker").click();
  }

  async smartTablePage() {
    await this.selectGroupMenuItem("Tables & Data");
    await this.page.getByText("Smart Table").click();
  }

  async toastrPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Toastr").click();
  }

  async tooltipPage() {
    await this.selectGroupMenuItem("Modal & Overlays");
    await this.page.getByText("Tooltip").click();
  }

  private async selectGroupMenuItem(GroupItemTitle: string) {
    const GroupMenuItem = this.page.getByTitle(GroupItemTitle);
    const expandedState = await GroupMenuItem.getAttribute("aria-expanded");
    if (expandedState == "false") await GroupMenuItem.click();
  }
}
