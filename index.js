const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use(express.json());

app.post("/", async (req, res) => {
  const { street_address, city, state, zip } = req.body;
  const url = `https://propwire.com/realestate/${street_address.replace(/ /g, "-")}-${city.replace(/ /g, "-")}-${state}-${zip}/property-details?filters=%7B%7D`;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("span.text-md", { timeout: 10000 });

    const ownerName = await page.$eval("span.text-md", el => el.innerText.trim());
    await browser.close();

    res.json({ owner_name: ownerName });
  } catch (err) {
    res.status(500).json({ error: "Could not get owner name", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
