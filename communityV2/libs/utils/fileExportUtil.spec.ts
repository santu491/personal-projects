import * as ExcelParser from 'node-excel-export';
import { FileExportUtil } from './fileExportUtil';
import { getCsvParser } from './getCsvParser';

describe('FileExportUtil UTest', () => {
  let csvMockParser: any = {
    parse: jest.fn()
  };
  (<any>getCsvParser) = jest.fn();
  (<any>getCsvParser).mockReturnValue(csvMockParser);
  ((ExcelParser as unknown) as { buildExport: () => void }).buildExport = jest.fn();
  let exporter = new FileExportUtil();

  beforeEach(() => {
    //nop
  });

  it('should not parse unknown export formats other than csv/excel', () => {
    expect(exporter.parseJson([], [], <any>'unknown')).toBe('');
  });

  it('should parse csv', () => {
    csvMockParser.parse.mockReturnValue('parsed csv');
    expect(exporter.parseJson([], [])).toBe('parsed csv');
  });

  it('should parse excel', () => {
    (ExcelParser.buildExport as unknown as jest.MockedFunction<any>).mockReturnValue('parsed excel');
    expect(
      exporter.parseJson(
        [
          {
            label: 'lbl1',
            value: 'val1'
          },
          {
            label: 'lbl2',
            value: 'val2',
            width: 200,
            headerStyle: { fill: 'fill' }
          }
        ],
        [],
        'excel'
      )
    ).toBe('parsed excel');
    let param = (ExcelParser.buildExport as unknown as jest.MockedFunction<any>).mock.calls[0][0];
    expect(param.length).toBe(1);
    expect(param[0].name).toBe('Export');
    expect(param[0].specification['val1'].displayName).toBe('lbl1');
    expect(param[0].specification['val2'].width).toBe(200);
  });

  afterEach(() => {
    //nop
  });
});
