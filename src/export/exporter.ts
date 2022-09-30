import { CursorTheme } from "../models/cursor-theme";

export interface Exporter {
    export(outputDirectory: string): Promise<CursorTheme>
}