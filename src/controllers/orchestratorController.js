import { init } from "../models/orchestrator.js";

export const controller = (filePath) => {
  filePath ? init(filePath) : init();
};
