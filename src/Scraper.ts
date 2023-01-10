import puppeteer from "puppeteer";
import { username, password } from "./config.json";
import wait from "wait";
import { eventInterface } from "./database/schema";
export const getLastEvent = async () => {
  console.log("looking");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://app.levelfields.ai");
  await page.type(".Login_Input__XlFCw", username);
  await page.click(".Login_PasswordWrapper__io09P");
  await page.type(".Login_PasswordWrapper__io09P", password);
  await page.click(".Login_Button__jkxUr[type=submit]");
  await page.waitForNavigation();
  await page.goto("https://app.levelfields.ai/dashboard");

  const button: any = await page.waitForSelector(
    "xpath/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[1]/button[2]"
  );
  await button.click();

  const myRequests = await page.waitForSelector(
    "xpath/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[1]/div/div/div[1]/h4"
  );
  await wait(500);
  const companyNameNode = await page.waitForSelector(
    "xpath/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[2]/div[1]/div/div/div[2]/a/div[1]"
  );
  const scenarioNode = await page.waitForSelector(
    "xpath/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[2]/div[2]/div/a/p"
  );
  const bobNode = await page.waitForSelector(
    "xpath//html/body/div[1]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[2]/div[8]/div/p/img"
  );
  const dateNode = await page.waitForSelector(
    "xpath/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[2]/div/div/div[2]/div/div/div/div/div[2]/div[4]/div/p"
  );
  const date1 = await dateNode?.getProperty("textContent");
  const companyName1 = await companyNameNode?.getProperty("textContent");
  const scenario1 = await scenarioNode?.getProperty("textContent");
  const bob1 = await bobNode?.getProperty("src");
  const date = await date1?.jsonValue();
  const companyName = await companyName1?.jsonValue();
  const scenario = await scenario1?.jsonValue();
  const bob = await bob1?.jsonValue();
  await browser.close();
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
