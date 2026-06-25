/**
 * Ritem Pro - Server-side Chart Renderer
 * Uses chartjs-node-canvas to render charts to PNG data URLs for embedding in slide HTML.
 */
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import * as ChartJSModule from "chart.js";

const ChartJS: any = (ChartJSModule as any).default ?? ChartJSModule;
const Chart = ChartJS.Chart ?? (ChartJSModule as any).Chart;
const registerables = ChartJS.registerables ?? (ChartJSModule as any).registerables;
if (Chart && registerables && Array.isArray(registerables)) {
  Chart.register(...registerables);
}

const WIDTH = 760;
const HEIGHT = 420;

function paletteFromTheme(theme: any, count: number): string[] {
  const base = [theme?.primaryColor || "#00FFC6", theme?.secondaryColor || "#7C4DFF", "#8A7A6A", "#B8A89A", "#4A3728"];
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(base[i % base.length]);
  return out;
}

export async function renderChartToDataUrl(chart: any, theme: any): Promise<string> {
  const canvas = new ChartJSNodeCanvas({ width: WIDTH, height: HEIGHT, backgroundColour: "white" });
  const palette = paletteFromTheme(theme, Math.max((chart?.datasets || []).length, (chart?.labels || []).length));

  let config: any;
  if (chart?.type === "pie") {
    config = {
      type: "pie",
      data: {
        labels: chart.labels,
        datasets: [
          {
            data: chart.datasets?.[0]?.data || [],
            backgroundColor: paletteFromTheme(theme, chart.labels?.length || 1),
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme?.fontBody || "Inter" } },
          legend: { position: "right", labels: { font: { family: theme?.fontBody || "Inter", size: 13 } } },
        },
      },
    };
  } else if (chart?.type === "line") {
    config = {
      type: "line",
      data: {
        labels: chart.labels,
        datasets: (chart.datasets || []).map((ds: any, i: number) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color || palette[i],
          backgroundColor: (ds.color || palette[i]) + "33",
          tension: 0.25,
          fill: false,
          pointRadius: 4,
        })),
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme?.fontBody || "Inter" } },
          legend: { display: (chart.datasets || []).length > 1, labels: { font: { family: theme?.fontBody || "Inter", size: 13 } } },
        },
        scales: {
          x: { title: { display: !!chart.xAxisLabel, text: chart.xAxisLabel, font: { family: theme?.fontBody || "Inter" } } },
          y: { title: { display: !!chart.yAxisLabel, text: chart.yAxisLabel, font: { family: theme?.fontBody || "Inter" } }, beginAtZero: true },
        },
      },
    };
  } else {
    config = {
      type: "bar",
      data: {
        labels: chart.labels,
        datasets: (chart.datasets || []).map((ds: any, i: number) => ({ label: ds.label, data: ds.data, backgroundColor: ds.color || palette[i], borderRadius: 4 })),
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme?.fontBody || "Inter" } },
          legend: { display: (chart.datasets || []).length > 1, labels: { font: { family: theme?.fontBody || "Inter", size: 13 } } },
        },
        scales: {
          x: { title: { display: !!chart.xAxisLabel, text: chart.xAxisLabel, font: { family: theme?.fontBody || "Inter" } } },
          y: { title: { display: !!chart.yAxisLabel, text: chart.yAxisLabel, font: { family: theme?.fontBody || "Inter" } }, beginAtZero: true },
        },
      },
    };
  }

  const buffer = await canvas.renderToBuffer(config);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export async function renderAllCharts(charts: Record<string, any>, theme: any): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const [key, chart] of Object.entries(charts)) {
    if (chart) {
      try {
        out[key] = await renderChartToDataUrl(chart, theme);
      } catch (err) {
        console.warn("Chart render failed for", key, err);
      }
    }
  }
  return out;
}
