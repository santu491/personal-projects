import { Parser } from 'json2csv';

jest.genMockFromModule('json2csv');
jest.mock('json2csv');

export const csvMockParser = {
  parse: jest.fn()
};

((Parser as unknown) as jest.MockedFunction<() => void>).mockImplementation(() => {
  return csvMockParser;
});
