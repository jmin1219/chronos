export type ProjectType = {
  id: number;
  name: string;
  color: string;
  description?: string;
};

export type ProjectFormValuesType = {
  name: string;
  color: string;
  description?: string;
};

export type ProjectAPIRequestType = {
  name: string;
  color: string;
  description?: string;
};
