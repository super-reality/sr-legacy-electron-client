export type EffectMessageType =
  | "SET_BOOL_PARAMETER"
  | "SET_INT_PARAMETER"
  | "SET_FLOAT_PARAMETER"
  | "SET_STRING_PARAMETER"
  | "SET_VECTOR2_PARAMETER"
  | "SET_VECTOR3_PARAMETER"
  | "SET_COLOR_PARAMETER"
  | "SET_COLOR32_PARAMETER";

export interface EffectMessageBase {
  type: EffectMessageType;
  payload: {
    name: string;
  };
}

export interface EffectMessageBool extends EffectMessageBase {
  type: "SET_BOOL_PARAMETER";
  payload: {
    name: string;
    value: boolean;
  };
}

export interface EffectMessageInt extends EffectMessageBase {
  type: "SET_INT_PARAMETER";
  payload: {
    name: string;
    value: BigInt;
  };
}

export interface EffectMessageFloat extends EffectMessageBase {
  type: "SET_FLOAT_PARAMETER";
  payload: {
    name: string;
    value: number;
  };
}

export interface EffectMessageString extends EffectMessageBase {
  type: "SET_STRING_PARAMETER";
  payload: {
    name: string;
    value: string;
  };
}

export interface EffectMessageVector2 extends EffectMessageBase {
  type: "SET_VECTOR2_PARAMETER";
  payload: {
    name: string;
    value: { x: number; y: number };
  };
}

export interface EffectMessageVector3 extends EffectMessageBase {
  type: "SET_VECTOR3_PARAMETER";
  payload: {
    name: string;
    value: { x: number; y: number; z: number };
  };
}

export interface EffectMessageColor extends EffectMessageBase {
  type: "SET_COLOR_PARAMETER";
  payload: {
    name: string;
    value: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
  };
}

export interface EffectMessageColor32 extends EffectMessageBase {
  type: "SET_COLOR32_PARAMETER";
  payload: {
    name: string;
    value: {
      r: BigInt;
      g: BigInt;
      b: BigInt;
      a: BigInt;
    };
  };
}

export type EffectMessage =
  | EffectMessageBool
  | EffectMessageInt
  | EffectMessageFloat
  | EffectMessageString
  | EffectMessageVector2
  | EffectMessageVector3
  | EffectMessageColor
  | EffectMessageColor32;

export interface EffectAction {
  type: string;
  payload: {
    name: string;
  };
}

export type EffectType =
  | "Bool"
  | "Int"
  | "Float"
  | "String"
  | "Vector2"
  | "Vector3"
  | "Color"
  | "Color32";

export interface EffectJsonAction {
  name: string;
}

export interface EffectJsonParameter {
  name: string;
  type: EffectType;
}

export interface EffectData {
  name: string;
  tags: string[];
  parameters: [];
  actions: EffectJsonAction[];
  id: string;
  thumbnail: string;
  url: string;
}
