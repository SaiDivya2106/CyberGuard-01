import { describe, it, expect } from "vitest";
import { buildSmsClassifier, isUrlKnownMalicious } from "../lib/datasetUtils";

describe("dataset utilities", () => {
  it("buildSmsClassifier should produce a working classifier", () => {
    const cls = buildSmsClassifier();
    // some strings that are very likely spam in the dataset
    expect(cls.classify("Free money, click here to claim your prize")).toBe("spam");
    expect(cls.classify("Meeting at 5pm, see you there")).toBe("ham");
    // probability should be in [0,1]
    const p = cls.spamProbability("You won a lottery");
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });

  it("isUrlKnownMalicious should match bad entries", () => {
    // make sure the dataset actually contains our sample string
    const sample = "stocktradex.com/087gbdv4";
    // we can't easily access the array here (not exported) so we just rely on
    // the lookup function itself to prove the string is treated as bad.
    expect(isUrlKnownMalicious(sample)).toBe(true);
    // a safe URL should return false
    expect(isUrlKnownMalicious("https://example.com")).toBe(false);
  });
});