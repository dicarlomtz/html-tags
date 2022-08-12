import { readCSVFile } from "../helpers/helpers.js";
import { tagCleaner, parseInit } from "./parser.js";

const DEFAULT_FILE_PATH = "src/data/tags.csv";
const DEFAULT_DELIMITER = "\n";
const DEFAULT_CHARS_PRESENT = ["<", ">"];

export const init = (filePath = DEFAULT_FILE_PATH) => {
  readCSVFile(
    filePath,
    DEFAULT_DELIMITER,
    DEFAULT_CHARS_PRESENT,
    tagCleaner
  ).then((data) => analyzeData(data));
};

const analyzeData = (data) => {
  parseInit(data);
};
