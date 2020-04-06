import { expect } from "chai";
import { promiseMap } from "../utils/promiseMap";

describe("utils/promiseMap()", () => {
  it("should return a promise of resolved values", async () => {
    const iterator = async (val: string, i: number) => `${val}-${i}`;
    const result = await promiseMap(["a", "b", "c"], iterator);
    expect(result).to.deep.equal(["a-0", "b-1", "c-2"]);
  });
});
