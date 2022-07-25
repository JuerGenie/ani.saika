import { DataConnection } from "peerjs";
import { string } from "typescript-lodash";

export interface ModelDataMap {
  login: string;
  logout: void;
  message: string;
  call: {
    id: string;
    method: string;
    parameters: unknown[];
  };
  "call-error": {
    id: string;
    error: string;
  };
  "call-result": {
    id: string;
    result: unknown;
  };
}

export type ModelType = keyof ModelDataMap;
// type UpperFirstChar<T extends string> = `${string.ToUpperCase<string.CharAt<T, 0>>}${string.SubString<T, 1, string.GetStringLength<T>>}`;

export type ModelData = {
  [key in keyof ModelDataMap]: {
    type: key;
    data: ModelDataMap[key];
  };
};

export function isModel<T extends ModelType>(
  data: unknown,
  type?: T
): data is ModelData[T] {
  return (
    !!data &&
    typeof data === "object" &&
    "type" in data &&
    ((!type && !!(data as any).type) || (data as any).type === type)
  );
}

export type LogData<T extends ModelType = ModelType> = {
  type: T;
  from?: DataConnection["connectionId"];
  timestamp: number;
  data: ModelData[T]["data"];
};
export type LogType = LogData["type"];

export function isLog<T extends LogType>(
  data: unknown,
  type?: T
): data is LogData<T> {
  return (
    !!data &&
    typeof data === "object" &&
    "type" in data &&
    ((!type && !!(data as any).type) || (data as any).type === type)
  );
}
