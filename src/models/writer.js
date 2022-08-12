import fs from "fs";

const DEFAULT_TAG_FILE_PATH = "src/data/tags.json";

export const writeToJSONFile = (data, filePath = DEFAULT_TAG_FILE_PATH) => {
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    if (err) console.log(err);
  });
};
