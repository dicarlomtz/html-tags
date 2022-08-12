import {
  getValidEntryPositions,
  tagCleaner,
  validEntryPosition,
  validEntryTags,
} from "../../models/parser";

describe("Tests on critic parser functions", () => {
  test("Test clean entry", () => {
    const dataTest = "asdasd<asdasd>asdasd";
    const dataClean = "<asdasd>";
    expect(tagCleaner(dataTest)).toBe(dataClean);
  });
  test("Test valid entry tags", () => {
    const dataTest = "asdasd<asdasd>asdasd";
    expect(validEntryTags(dataTest)).toBeTruthy();
  });
  test("Test no valid entry tags", () => {
    const dataTest = "asdasdasdasd>asdasd";
    expect(validEntryTags(dataTest)).toBeFalsy();
  });
  test("Test valid entry tags positions", () => {
    const dataTest = "asdasd<asdasd>asdasd";
    expect(validEntryPosition(dataTest)).toBeTruthy();
  });
  test("Test no valid entry tags positions", () => {
    const dataTest = "asdasdasdasd><asdasd";
    expect(validEntryPosition(dataTest)).toBeFalsy();
  });
  test("Test get valid entry by positions", () => {
    const dataTest = "><asdsad>";
    const dataClean = "<asdsad>";
    expect(getValidEntryPositions(dataTest)).toBe(dataClean);
  });
});
