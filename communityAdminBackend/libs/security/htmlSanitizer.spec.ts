import { HtmlSanitizer } from './htmlSanitizer';

describe('HtmlSanitizer UTest', () => {
  let sanitizer: HtmlSanitizer;
  let sanitizer2: HtmlSanitizer;

  beforeEach(() => {
    sanitizer = new HtmlSanitizer(['b', 'h4', 'a'], {
      '*': ['href', 'alt']
    });
    sanitizer2 = new HtmlSanitizer();
  });

  it('should sanitize properties by default for html', () => {
    expect(sanitizer.sanitize('test<b>password</b>hello<script></script>')).toBe('test<b>password</b>hello');
    expect(sanitizer.sanitize('test<b>password</b>hello<a href="https://www.google.comtest" class="link">link</a>')).toBe('test<b>password</b>hello<a href="https://www.google.comtest">link</a>');
  });

  it('should sanitize properties by default for html', () => {
    expect(sanitizer2.sanitize('test<b>password</b>hello<script></script>')).toBe('test<b>password</b>hello');
    expect(sanitizer2.sanitize('test<b>password</b>hello<a href="https://www.google.comtest" class="link">link</a>')).toBe('test<b>password</b>hello<a href="https://www.google.comtest">link</a>');
  });
});
