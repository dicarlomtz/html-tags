import { writeToJSONFile } from "./writer.js";
import htmlTags from "html-tags";
import voidHtmlTags from "html-tags/void.js";

/**
 * It takes a string, finds the first and last index of the tag, and returns the tag
 * @param entry - The string that you want to clean.
 * @returns The substring of the entry between the first "<" and the last ">"
 */
export const tagCleaner = (entry) => {
  return entry.substring(entry.indexOf("<"), entry.lastIndexOf(">") + 1);
};

export const parseInit = (data) => {
  parseTags(data);
};

const parseTags = (data) => {
  const tags = {};
  data.forEach((entry) => {
    assembler(entry, tags);
  });
  writeToJSONFile(tags);
};

/**
 * The function assembles a valid entry by checking if the entry has valid tags, and if it does, it
 * gets the valid entry positions, gets the tag name, gets the corresponding entry, and if the tag is
 * valid, it saves the tag
 * @param entry - the current entry being processed
 * @param tags - an object that will hold the tags that are found in the entry
 */
const assembler = (entry, tags) => {
  while (validEntryTags(entry) && validEntryPosition(entry)) {
    entry = getValidEntryPositions(entry);
    if (validEntryTags) {
      const [startIndex, endIndex] = getTagIndices(entry);
      const tagName = getTagName(entry, startIndex, endIndex);
      entry = getCorrespondingEntry(tagName, entry, startIndex);
      if (verifyValidTag(tagName)) saveTag(tagName, tags);
    }
  }
};

const saveTag = (tagName, tags) => {
  if (verifyValidSelfClosedFormat(tagName) && isSelfClosedTag(tagName))
    tagName = getSelfClosedTagName(tagName);
  if (!isRepeatedTag(tagName, tags)) showValidTag(tagName);
  isRepeatedTag(tagName, tags) ? tags[tagName]++ : (tags[tagName] = 1);
};

export const getSelfClosedTagName = (tagName) => {
  return tagName.substring(0, tagName.length - 1);
};

const verifyValidTag = (tagName) => {
  if (verifyValidSelfClosedFormat(tagName)) return isSelfClosedTag(tagName);
  return htmlTags.includes(tagName);
};

const isSelfClosedTag = (tagName) => {
  return voidHtmlTags.includes(tagName.substring(0, tagName.length - 1));
};

export const verifyValidSelfClosedFormat = (tagName) => {
  return tagName.includes("/")
    ? tagName.indexOf("/") === tagName.length - 1
    : false;
};

const isRepeatedTag = (tagName, tags) => {
  return tags.hasOwnProperty(tagName);
};

const showValidTag = (tagName) => {
  console.log("<" + tagName + ">");
};

export const validEntryTags = (entry) => {
  return entry.includes("<") && entry.includes(">");
};

export const validEntryPosition = (entry) => {
  return entry.indexOf("<") < entry.lastIndexOf(">");
};

/**
 * It takes a string and returns a substring of the string that contains the first valid entry tag
 * @param entry - The string to be parsed
 * @returns the entry if the startIndex is greater than the endIndex and the entry is valid.
 */
export const getValidEntryPositions = (entry) => {
  const [startIndex, endIndex] = getTagIndices(entry);
  if (startIndex > endIndex && validEntryTags(entry)) {
    return getValidEntryPositions(entry.substring(startIndex, entry.length));
  }
  return entry;
};

const getTagIndices = (entry) => {
  const startIndex = entry.indexOf("<");
  const endIndex = entry.indexOf(">");
  return [startIndex, endIndex];
};

const getTagName = (entry, startIndex, endIndex) => {
  if (startIndex > endIndex) return "";
  const tagFound = entry.substring(startIndex, endIndex + 1);
  const tagName = tagFound.substring(
    tagFound.indexOf("<") + 1,
    tagFound.indexOf(">")
  );

  return tagName;
};

const getCorrespondingEntry = (tagName, entry, startIndex) => {
  const invalidTag = tagName.includes("<");

  if (invalidTag) return entry.substring(startIndex + 1, entry.length);

  return entry.substring(entry.indexOf(">") + 1, entry.length);
};
