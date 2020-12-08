export type InputChangeEv =
  | React.ChangeEvent<HTMLInputElement>
  | React.KeyboardEvent<HTMLInputElement>;

export type AreaChangeEv =
  | React.ChangeEvent<HTMLTextAreaElement>
  | React.KeyboardEvent<HTMLTextAreaElement>;

export interface CVResult {
  dist: number;
  sizeFactor: number;
  x: number;
  y: number;
  width: number;
  height: number;
  time: number;
  id: string;
}

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ValueOf<T> = T[keyof T];

export interface EffectDB {
  id: string;
  name: string;
  url: string;
  tags: string[];
}

export interface EffectAction {
  name: string;
}

export interface EffectData {
  name: string;
  tags: string[];
  parameters: [];
  actions: EffectAction[];
  url: string;
}
