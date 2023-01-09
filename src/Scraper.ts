import puppeteer from "puppeteer";
import { username, password } from "./config.json";
import wait from "wait";
import { eventInterface } from "./database/schema";
export const getLastEvent = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://app.levelfields.ai");
  await page.type(".Login_Input__XlFCw", username);
  await page.click(".Login_PasswordWrapper__io09P");
  await page.type(".Login_PasswordWrapper__io09P", password);
  await page.click(".Login_Button__jkxUr[type=submit]");
  await page.waitForNavigation();
  await page.goto("https://app.levelfields.ai/dashboard");
  // Scrape data from the dashboard page here
  //   await page.click(".My Alerts");
  //select the button named My Alerts
  const button: any = await page.$x('//button[contains(text(), "My Alerts")]');
  await button[0]?.click();
  wait(5000);
  const div = await page.$(".TableCell");
  const companyNameNode = await page.waitForSelector(
    "div.Table-row:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1) > div:nth-child(1)"
  );
  const scenarioNode = await page.waitForSelector(
    "div.Table-row:nth-child(2) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > p:nth-child(1)"
  );
  const bobNode = await page.waitForSelector(
    "div.Table-row:nth-child(2) > div:nth-child(8) > div:nth-child(1) > p:nth-child(1) > img:nth-child(1)"
  );
  const dateNode = await page.waitForSelector(
    "div.Table-row:nth-child(2) > div:nth-child(4) > div:nth-child(1) > p:nth-child(1)"
  );
  const date1 = await dateNode?.getProperty("textContent");
  const companyName1 = await companyNameNode?.getProperty("textContent");
  const scenario1 = await scenarioNode?.getProperty("textContent");
  const bob1 = await bobNode?.getProperty("src");
  const date = await date1?.jsonValue();
  const companyName = await companyName1?.jsonValue();
  const scenario = await scenario1?.jsonValue();
  const bob = await bob1?.jsonValue();
  console.log(companyName, scenario, bob);
  if (companyName && scenario && bob && date)
    return {
      ticker: companyName,
      scenario: scenario,
      bob: bob?.endsWith("bear.c78a45665e1f859de9b4f1f0618c1a40.svg")
        ? "bearish 🐻"
        : "bullish 🐂",
      date: date,
    } as eventInterface;
  return null;
};
