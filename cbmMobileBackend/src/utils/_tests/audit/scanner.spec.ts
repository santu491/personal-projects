import {APP} from '../../app';
import {Scanner} from '../../audit/scanner';
import {appConfig} from '../../mockData';

describe('Scanner', () => {
  let scanner: Scanner;

  beforeEach(() => {
    APP.config.security = appConfig.security;
    scanner = Scanner.getInstance();
  });

  describe('scanInput', () => {
    it('should scan an array input', () => {
      const input = [1, 2, 3];
      const result = scanner.scanInput(input);
      expect(result).toEqual(input);
    });

    it('should scan an object input', () => {
      const input = {name: 'John', age: 30};
      const result = scanner.scanInput(input);
      expect(result).toEqual(input);
    });

    it('should scan a string input', () => {
      const input = 'Hello, World!';
      const result = scanner.scanInput(input);
      expect(result).toEqual(input);
    });

    it('should scan an input with specified propPath and propName', () => {
      const input = {name: 'John', age: 30};
      const propPath = 'users';
      const propName = 'user1';
      const result = scanner.scanInput(input, propPath, propName);
      expect(result).toEqual(input);
    });

    it('should scan an input with maxLength limit', () => {
      const input = 'This is a long string';
      const maxLength = 10;
      const result = scanner.scanInput(input, 'root', '', maxLength);
      expect(result).toEqual('This is a long string');
    });
  });

  describe('scanUrl', () => {
    it('should scan a valid URL', () => {
      const url = 'https://example.com?param=1&name=John';
      const result = scanner.scanUrl(url);
      expect(result).toEqual('https://example.com?param=1&name=********');
    });
  });
});
