import { STAGE, getStage } from "./stage";

describe("getStage", () => {
  const oldEnv = process.env;

  beforeEach(() => {
    delete process.env.REACT_APP_STAGE;
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  it("should return STAGE.DEV when REACT_APP_STAGE is not set", () => {
    expect(getStage()).toBe(STAGE.DEV);
  });

  it("should return STAGE.DEV when REACT_APP_STAGE is set to an unknown value", () => {
    process.env.REACT_APP_STAGE = "unknown";
    expect(getStage()).toBe(STAGE.DEV);
  });

  const stages = ["dev", "staging", "production"];
  stages.forEach((stage) => {
    it(`should return STAGE.${stage.toUpperCase()} when REACT_APP_STAGE is set to "${stage}"`, () => {
      process.env.REACT_APP_STAGE = stage;
      expect(getStage()).toBe(STAGE[stage.toUpperCase() as keyof typeof STAGE]);
    });

    it(`should return STAGE.${stage.toUpperCase()} when REACT_APP_STAGE is set to "${stage.toUpperCase()}"`, () => {
      process.env.REACT_APP_STAGE = stage.toUpperCase();
      expect(getStage()).toBe(STAGE[stage.toUpperCase() as keyof typeof STAGE]);
    });
  });
});
