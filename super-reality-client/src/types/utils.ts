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

export interface TypeValue {
  type: string;
  value: any;
}

export type ValueOf<T> = T[keyof T];
