import { FigmaExporter } from "./export/figma";


const apiKey = process.env.FIGMA_API_KEY;
if (!apiKey) {
    throw new Error("Provide your Figma API key through the 'FIGMA_API_KEY' environment variable.");
}
const fileId = process.env.FIGMA_FILE;
if (!fileId) {
    throw new Error("Provide your Figma file id through the 'FIGMA_FILE' environment variable.");
}

const exporter = new FigmaExporter(apiKey, fileId);
console.log(JSON.stringify(await exporter.export("./demo")));
