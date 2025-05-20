import json2csv from 'json2csv';
import * as ExcelParser from 'node-excel-export';
import { Service } from 'typedi';
import { getCsvParser } from './getCsvParser';

interface IExcelField {
  label: string;
  headerStyle?: unknown;
  width?: number;
  value: string;
}

@Service()
export class FileExportUtil {
  parseJson<T>(fields: json2csv.FieldInfo<T>[] | IExcelField[], data: Readonly<T> | readonly T[], format: 'csv' | 'excel' = 'csv') {
    if (format === 'csv') {
      return this.parseJsonToCsv(fields as json2csv.FieldInfo<T>[], data);
    } else if (format === 'excel') {
      return this.parseJsonToExcel(fields as IExcelField[], data);
    } else {
      return '';
    }
  }

  private parseJsonToCsv<T>(fields: json2csv.FieldInfo<T>[], data: Readonly<T> | readonly T[]) {
    const parser = getCsvParser({ fields });
    return parser.parse(data);
  }

  private parseJsonToExcel<T>(fields: IExcelField[], data: Readonly<T> | readonly T[]): string {
    const exFields: { [key: string]: { displayName: string; headerStyle: unknown; width: number } } = {};
    const defaultHeaderStype = {
      fill: {
        fgColor: {
          rgb: 'FFFFFFFF'
        }
      },
      font: {
        color: {
          rgb: 'FF000000'
        },
        sz: 14,
        bold: true
      }
    };
    fields.forEach((f) => {
      exFields[f.value] = {
        displayName: f.label,
        headerStyle: f.headerStyle || defaultHeaderStype,
        width: f.width || 100
      };
    });

    return ExcelParser.buildExport([
      {
        name: 'Export',
        data: data,
        specification: exFields
      }
    ]);
  }
}
