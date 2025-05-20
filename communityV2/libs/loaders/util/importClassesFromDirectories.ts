import * as path from 'path';

/**
 * Loads all exported classes from the given directory.
 */
export function importClassesFromDirectories(directories: string[], formats = ['.js', '.ts']): Function[] {
  const loadFileClasses = (exported: object | Array<object | Array<unknown> | Function> | Function, allLoaded: Function[]) => {
    if (exported instanceof Function) {
      allLoaded.push(exported);
    } else if (exported instanceof Array) {
      exported.forEach((i) => loadFileClasses(i, allLoaded));
    } else if (exported instanceof Object || typeof exported === 'object') {
      Object.keys(exported).forEach((key) => loadFileClasses((exported as { [key: string]: object | Function })[key], allLoaded));
    }

    return allLoaded;
  };

  const allFiles = directories.reduce((allDirs, dir) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return allDirs.concat(require('glob').sync(path.normalize(dir)));
  }, [] as string[]);

  const dirs = allFiles
    .filter((file) => {
      const dtsExtension = file.substring(file.length - 5, file.length);
      return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
    })
    .map((file) => {
      return require(file);
    });

  return loadFileClasses(dirs, []);
}

export function getFilesFromGlobPaths(globPaths: string[]): string[] {
  return globPaths.reduce((allDirs, dir) => {
    dir = dir.replace('/', '');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return allDirs.concat(require('glob').sync(path.normalize(dir)));
  }, [] as string[]);
}
