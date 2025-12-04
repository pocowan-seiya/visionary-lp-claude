// Vision / Product / Bridge Types

export type VisionSpecificScene = {
  place: string;
  timeOfDay: string;
  atmosphere: string;
  narrative: string;
};

export type VisionActualPhenomenon = {
  conversations: string;
  actions: string;
  visibleEvents: string;
};

export type VisionStateOfWorld = {
  industryShift: string;
  societyShift: string;
  newCommonSense: string;
};

export type VisionMyExistence = {
  role: string;
  actions: string;
  innerState: string;
};

export type VisionInfo = {
  specificScene: VisionSpecificScene;
  actualPhenomenon: VisionActualPhenomenon;
  stateOfWorld: VisionStateOfWorld;
  myExistence: VisionMyExistence;
};

export type ProductInfo = {
  serviceIdentity: {
    name: string;
    oneLiner: string;
    category: string;
  };
  originStory: string;
  targetAndPain: string[];
  mechanism: string;
  features: string[];
  roadmap: string[];
  offer: string;
  price: string;
  creatorStance: string;
};

export type BridgeInfo = {
  bridgeNarrative: string;
};

// Combined type for Vision + Product + Bridge
export type VisionProductData = {
  vision: VisionInfo;
  product: ProductInfo;
  bridge: BridgeInfo;
};
