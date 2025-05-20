import json2csv, { Parser } from 'json2csv';

export function getCsvParser<T>(options: json2csv.Options<T>) {
  return new Parser(options);
}
