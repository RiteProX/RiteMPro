/**
 * Ritem Pro - PDF renderer using Puppeteer
 * Renders supplied HTML to multi-page PDF, each slide at 1280x720 (16:9)
 */
import puppeteer from "puppeteer";

const SLIDE_W = 1280;
const SLIDE_H = 720;

export async function renderHTMLToPDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SLIDE_W, height: SLIDE_H });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ width: `${SLIDE_W}px`, height: `${SLIDE_H}px`, printBackground: true });
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
