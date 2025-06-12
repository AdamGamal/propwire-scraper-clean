const browser = await puppeteer.launch({
  headless: true,
  executablePath: puppeteer.executablePath(), // ✅ This line
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
