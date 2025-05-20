export type Mockify<T> = {
  [P in keyof T]: jest.Mock;
};
