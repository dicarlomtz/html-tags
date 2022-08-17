import { writeToJSONFile } from "./writer.js";

const OPEN_TAG = "<";
const CLOSE_TAG = ">";

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
 * It takes a string and an array of tags, and it finds all the tags in the string and adds them to the
 * array
 * @param entry - the string to be processed
 * @param tags - an object that will be populated with the tags found in the entry
 */
const assembler = (entry, tags) => {
  const tagCandidates = getTagCandidates(entry);
  tagCandidates.forEach((tagCandidate) => {
    const tagCloseIndex = getTagCloseIndex(tagCandidate);
    if (tagCloseIndex >= 0) processTag(tagCandidate, tagCloseIndex, tags);
  });
};

const processTag = (tagCandidate, tagCloseIndex, tags) => {
  const tag = getTag(tagCandidate, tagCloseIndex);
  if (tag.length > 0) {
    const tagName = getTagName(tag);
    if (verifyValidTagName(tagName)) {
      showTag(tagName, tags);
      saveTag(tagName, tags);
    }
  }
};

const getTagCandidates = (entry) => {
  return entry.split(OPEN_TAG);
};

const getTagCloseIndex = (tagCandidate) => {
  return tagCandidate.indexOf(CLOSE_TAG);
};

const getTag = (tagCandidate, tagCloseIndex) => {
  return tagCandidate.substring(0, tagCloseIndex).toLowerCase().trim();
};

/**
 * If the tag is self-closed, return the tag name without the slash, otherwise return the tag name up
 * to the first space.
 * @param tag - The tag to get the name from.
 * @returns The tag name of the tag passed in.
 */
const getTagName = (tag) => {
  const spaceIndex = tag.indexOf(" ");

  if (spaceIndex <= -1) return tag;

  const tagName = tag.substring(0, spaceIndex);
  return isSelfClosed(tagName)
    ? tagName.substring(0, tagName.length - 1)
    : tagName;
};

const isSelfClosed = (tagName) => {
  const lastPosition = tagName.length - 1;
  return tagName[lastPosition] === "/";
};

// Save and show tags

const isRepeatedTag = (tagName, tags) => {
  return tags.hasOwnProperty(tagName);
};

const saveTag = (tagName, tags) => {
  isRepeatedTag(tagName, tags) ? tags[tagName]++ : (tags[tagName] = 1);
};

const showTag = (tagName, tags) => {
  if (!isRepeatedTag(tagName, tags)) console.log("<" + tagName + ">");
};

// Verify valid tags

const verifyValidTagName = (tagName) => {
  return isFirstCharInvalid(tagName) ||
    containsInvalidChars(tagName) ||
    tagName.length <= 0
    ? false
    : true;
};

const isFirstCharInvalid = (tagName) => {
  return tagName.charCodeAt(0) >= 32 && tagName.charCodeAt(0) <= 64;
};

const containsInvalidChars = (tagName) => {
  let flag = false;
  [...tagName].forEach((element) => {
    if (
      (element.charCodeAt(0) >= 91 && element.charCodeAt(0) <= 96) ||
      (element.charCodeAt(0) >= 32 && element.charCodeAt(0) <= 44) ||
      (element.charCodeAt(0) >= 46 && element.charCodeAt(0) <= 47) ||
      (element.charCodeAt(0) >= 58 && element.charCodeAt(0) <= 64) ||
      element.charCodeAt(0) >= 123
    ) {
      flag = true;
    }
  });

  return flag;
};
