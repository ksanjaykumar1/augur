import "jest-environment-puppeteer";
import {UnlockedAccounts} from "./constants/accounts";

const url = `${process.env.AUGUR_URL}/#/market?id=0x6a30746a49e781016ddd4ef883d8b762dc492c04`;

jest.setTimeout(100000);

describe("Trading", () => {
  beforeAll(async () => {
    await page.goto(url);

    // No idea what a 'typical' desktop resolution would be for our users.
    await page.setViewport({
      height: 1200,
      width: 1200
    });
  });

  it("should display a modal", async () => {
    // dismiss welcome to beta popup.
    await expect(page).toClick("button", {
      text: "I have read and understand the above"
    });

    await expect(page).toClick("button", {
      text: "Sell"
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001");
    await expect(page).toFill("input#tr__input--limit-price", "0.0001");

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Confirm"
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    await page.evaluate((account) => window.integrationHelpers.updateAccountAddress(account), UnlockedAccounts.CONTRACT_OWNER);
    await expect(page).toClick("button", {
      text: "Buy"
    });

    await expect(page).toFill("input#tr__input--quantity", "0.0001");
    await expect(page).toFill("input#tr__input--limit-price", "0.0001");

    await expect(page).toClick("button", {
      text: "Review"
    });

    await expect(page).toClick("button", {
      text: "Confirm"
    });
  });
});
