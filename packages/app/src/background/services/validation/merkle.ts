import type { MerkleProof } from "@zk-kit/incremental-merkle-tree";

export enum MerkleProofValidatorErrors {
  INVALID_ROOT = "invalid-root",
  INVALID_SIBLINGS = "invalid-siblings",
  INVALID_PATH_INDICES = "invalid-path-indices",
  INVALID_LEAF = "invalid-leaf",
}

export class MerkleProofValidator {
  private proof: MerkleProof;

  constructor(proof: MerkleProof) {
    this.proof = proof;
  }

  validateProof = (): MerkleProofValidator =>
    this.validateRoot().validateSiblings().validatePathIndices().validateLeaf();

  validateRoot = (): MerkleProofValidator => {
    if (!this.proof.root) {
      throw new Error(MerkleProofValidatorErrors.INVALID_ROOT);
    }

    return this;
  };

  validateSiblings = (): MerkleProofValidator => {
    if (!this.proof.siblings.length) {
      throw new Error(MerkleProofValidatorErrors.INVALID_SIBLINGS);
    }

    return this;
  };

  validatePathIndices = (): MerkleProofValidator => {
    if (!this.proof.pathIndices.length) {
      throw new Error(MerkleProofValidatorErrors.INVALID_PATH_INDICES);
    }

    return this;
  };

  validateLeaf = (): MerkleProofValidator => {
    if (!this.proof.leaf) {
      throw new Error(MerkleProofValidatorErrors.INVALID_LEAF);
    }

    return this;
  };
}
