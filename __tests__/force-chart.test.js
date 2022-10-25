import puppeteer from "puppeteer";
import { error } from "console";

let browser = await puppeteer.launch({
  headless: true,
});
let page = await browser.newPage();
await page.goto("http://localhost:8080/force-graph.html");

try {
  //--silent=false
  test("force chart test", async () => {
    await page.waitForSelector("togostanza-force-graph");

    await page.click("#edge-show_arrows");

    const isArrowsHidden = await page.evaluate(() => {
      error("hi!");
      return document
        .querySelector("togostanza-force-graph")
        .shadowRoot.querySelector("#force-graph > svg > defs");
    });

    error(isArrowsHidden);

    expect(1).toBe(1);
  });
} catch (e) {
  error(e);
} finally {
  browser.close();
}
