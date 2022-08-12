import fs from "fs";
import { parse } from "csv-parse";

/**
 * It reads a CSV file, cleans the data, and returns an array of arrays
 * @param filePath - The path to the file you want to read.
 * @param delimiter - The delimiter used in the CSV file.
 * @param [charsPresent=null] - an array of characters that must be present in the row for it to be
 * valid.
 * @param [cleaningMethod=null] - This is a function that takes in a row and returns a cleaned row.
 */
export const readCSVFile = (
  filePath,
  delimiter,
  charsPresent = null,
  cleaningMethod = null
) => {
  const data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter, trim: true, quote: "" }))
      .on("data", (row) => {
        if (validRow(row, charsPresent)) {
          data.push(cleanEntry(row, cleaningMethod));
        }
      })
      .on("end", () => {
        resolve(data);
      });
  });
};

const validRow = ([row], charsPresent) => {
  return charsPresent ? charsPresent.every((char) => row.includes(char)) : true;
};

const cleanEntry = ([row], cleaningMethod) => {
  return cleaningMethod ? cleaningMethod(row) : row;
};
