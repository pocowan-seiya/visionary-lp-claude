import { VisionInfo, ProductInfo, BridgeInfo } from "@/types";

/**
 * Validate VisionInfo structure
 */
export function validateVisionInfo(data: any): data is VisionInfo {
  if (!data || typeof data !== "object") return false;

  const { specificScene, actualPhenomenon, stateOfWorld, myExistence } = data;

  // Validate specificScene
  if (
    !specificScene ||
    typeof specificScene !== "object" ||
    typeof specificScene.place !== "string" ||
    typeof specificScene.timeOfDay !== "string" ||
    typeof specificScene.atmosphere !== "string" ||
    typeof specificScene.narrative !== "string"
  ) {
    return false;
  }

  // Validate actualPhenomenon
  if (
    !actualPhenomenon ||
    typeof actualPhenomenon !== "object" ||
    typeof actualPhenomenon.conversations !== "string" ||
    typeof actualPhenomenon.actions !== "string" ||
    typeof actualPhenomenon.visibleEvents !== "string"
  ) {
    return false;
  }

  // Validate stateOfWorld
  if (
    !stateOfWorld ||
    typeof stateOfWorld !== "object" ||
    typeof stateOfWorld.industryShift !== "string" ||
    typeof stateOfWorld.societyShift !== "string" ||
    typeof stateOfWorld.newCommonSense !== "string"
  ) {
    return false;
  }

  // Validate myExistence
  if (
    !myExistence ||
    typeof myExistence !== "object" ||
    typeof myExistence.role !== "string" ||
    typeof myExistence.actions !== "string" ||
    typeof myExistence.innerState !== "string"
  ) {
    return false;
  }

  return true;
}

/**
 * Validate ProductInfo structure
 */
export function validateProductInfo(data: any): data is ProductInfo {
  if (!data || typeof data !== "object") return false;

  const {
    serviceIdentity,
    originStory,
    targetAndPain,
    mechanism,
    features,
    roadmap,
    offer,
    price,
    creatorStance,
  } = data;

  // Validate serviceIdentity
  if (
    !serviceIdentity ||
    typeof serviceIdentity !== "object" ||
    typeof serviceIdentity.name !== "string" ||
    typeof serviceIdentity.oneLiner !== "string" ||
    typeof serviceIdentity.category !== "string"
  ) {
    return false;
  }

  // Validate required string fields
  if (
    typeof originStory !== "string" ||
    typeof mechanism !== "string" ||
    typeof offer !== "string" ||
    typeof price !== "string" ||
    typeof creatorStance !== "string"
  ) {
    return false;
  }

  // Validate arrays
  if (
    !Array.isArray(targetAndPain) ||
    !targetAndPain.every((item) => typeof item === "string")
  ) {
    return false;
  }

  if (
    !Array.isArray(features) ||
    !features.every((item) => typeof item === "string")
  ) {
    return false;
  }

  if (
    !Array.isArray(roadmap) ||
    !roadmap.every((item) => typeof item === "string")
  ) {
    return false;
  }

  return true;
}

/**
 * Validate BridgeInfo structure
 */
export function validateBridgeInfo(data: any): data is BridgeInfo {
  if (!data || typeof data !== "object") return false;

  const { bridgeNarrative } = data;

  if (typeof bridgeNarrative !== "string") {
    return false;
  }

  return true;
}

/**
 * Validate complete Vision/Product/Bridge data
 * Note: Allows partial data for step-by-step saving
 */
export function validateVisionProductData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid data format"] };
  }

  // At least one section should be provided
  if (!data.vision && !data.product && !data.bridge) {
    errors.push("At least one of Vision, Product, or Bridge data is required");
    return { valid: false, errors };
  }

  // Validate Vision (only if provided)
  if (data.vision && !validateVisionInfo(data.vision)) {
    errors.push("Invalid Vision data structure");
  }

  // Validate Product (only if provided)
  if (data.product && !validateProductInfo(data.product)) {
    errors.push("Invalid Product data structure");
  }

  // Validate Bridge (only if provided)
  if (data.bridge && !validateBridgeInfo(data.bridge)) {
    errors.push("Invalid Bridge data structure");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
