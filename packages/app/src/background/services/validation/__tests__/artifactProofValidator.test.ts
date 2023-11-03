import { ArtifactsProofValidator, ArtifactsProofValidatorErrors } from "../artifact";

describe("background/services/validation/artifact", () => {
  test("should validate proof properly", () => {
    const validator = new ArtifactsProofValidator({ depth: 1, leaves: ["leaf-1"], leavesPerNode: 1 });

    expect(() => validator.validateProof()).not.toThrow();
  });

  test("should throw error if there is zero depth", () => {
    const validator = new ArtifactsProofValidator({ depth: 0, leaves: ["leaf-1"], leavesPerNode: 1 });

    expect(() => validator.validateProof()).toThrow(ArtifactsProofValidatorErrors.INVALID_DEPTH);
    expect(() => validator.validateDepth()).toThrow(ArtifactsProofValidatorErrors.INVALID_DEPTH);
  });

  test("should throw error if there are no leaves", () => {
    const validator = new ArtifactsProofValidator({ depth: 1, leaves: [], leavesPerNode: 1 });

    expect(() => validator.validateProof()).toThrow(ArtifactsProofValidatorErrors.INVALID_LEAVES);
    expect(() => validator.validateLeaves()).toThrow(ArtifactsProofValidatorErrors.INVALID_LEAVES);
  });

  test("should throw error if there is zero leaves per node", () => {
    const validator = new ArtifactsProofValidator({ depth: 1, leaves: ["leaf-1"], leavesPerNode: 0 });

    expect(() => validator.validateProof()).toThrow(ArtifactsProofValidatorErrors.INVALID_LEAVES_PER_NODE);
    expect(() => validator.validateLeavesPerNode()).toThrow(ArtifactsProofValidatorErrors.INVALID_LEAVES_PER_NODE);
  });
});
