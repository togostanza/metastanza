import puppeteer from "puppeteer";

test("force chart test", async () => {
  let browser = await puppeteer.launch({
    headless: true,
  });

  let page = await browser.newPage();

  await page.goto("http://localhost:8080/force-graph.html");

  await page.waitForSelector("togostanza-force-graph");

  const dataType = await page.$eval("togostanza-force-graph", (e) =>
    e.getAttribute("data-type")
  );

  expect(dataType).toBe("json");

  browser.close();
});
