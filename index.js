const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  try {
    const { street_address, city, state, zip } = req.body;

    if (!street_address || !city || !state || !zip) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formattedStreet = street_address.replace(/ /g, "-");
    const url = `https://propwire.com/realestate/${formattedStreet}-${city}-${state}-${zip}/owner-details?filters=%7B%7D`;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const ownerName = await page.$eval(".text-md.font-bold", el => el.innerText);

    await browser.close();

    res.json({ owner_name: ownerName });
  } catch (err) {
    console.error("Error in scraper:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
