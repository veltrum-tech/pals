
export interface LGA {
  id: string;
  name: string;
  state_id: string;
  state?: State;
  supervisor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface GetStatesResponse {
  states: State[];
}

export interface GetLGAsResponse {
  lgas: LGA[];
  total?: number;
}

export interface State {
  id: string;
  name: string;
  code: string;
}