import * as appRoot from 'app-root-path';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { lstatSync, readdirSync, statSync } from 'fs';
import * as path from 'path';
import { join } from 'path';
import { affectedAppNames, AffectedFetcher, affectedLibNames, affectedProjectNames, affectedProjectNamesWithTarget, dependencies, Dependency, DepGraph, ProjectNode, ProjectType, touchedProjects } from './affected-apps';
import { readJsonFile } from './utils/fileutils';

export type ImplicitDependencyEntry = { [key: string]: string[] };
export type ImplicitDependencies = {
  files: ImplicitDependencyEntry;
  projects: ImplicitDependencyEntry;
};

export function parseFiles(sha1?: string, sha2?: string): { files: string[] } {
  let commits = parseGitOutput(`git log -n 3 --format=format:%H`);
  let files = sha1 && sha2 ? getFilesFromShash(sha2, sha1) : [];
  files = commits.length > 1 && !files.length ? getFilesFromShash(commits[1], commits[0]) : files;
  files = commits.length > 2 && !files.length ? getFilesFromShash(commits[2], commits[0]) : files;
  return {
    files: files
  };
}

function getFilesFromShash(sha1: string, sha2: string): string[] {
  return parseGitOutput(`git diff --name-only ${sha1} ${sha2}`);
}

function parseGitOutput(command: string): string[] {
  try {
    return execSync(command)
      .toString('utf-8')
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export function assertWorkspaceValidity(angularJson) {
  const angularJsonProjects = Object.keys(angularJson.projects);

  if (angularJsonProjects.length <= 0) {
    throw new Error(`projects are missing`);
  }
}

export function getProjectNodes(): ProjectNode[] {
  const isDirectory = (source) => lstatSync(source).isDirectory();
  const getDirectories = (source) =>
    readdirSync(source)
      .map((name) => join(source, name))
      .filter(isDirectory);
  const apis = getDirectories(`${appRoot.path}/api`)
    .filter((d) => {
      return true;
      //return d.indexOf('virtual') < 0;
    })
    .map((d) => {
      return getDirectories(d).map((sd) => {
        return {
          files: allFilesInDir(sd),
          type: 'api',
          name: sd.replace(`${appRoot.path}/api/`, '').replace('/', '-'),
          implicitDependencies: [],
          root: sd.replace(`${appRoot.path}/`, '')
        };
      });
    })
    .reduce((a, b) => {
      return a.concat(b);
    }, []);
  const libs = getDirectories(`${appRoot.path}/libs`)
    .filter((d) => {
      return true;
    })
    .map((d) => {
      return {
        files: allFilesInDir(d),
        type: 'lib',
        name: `lib-${d.replace(`${appRoot.path}/libs/`, '')}`,
        implicitDependencies: [],
        root: d.replace(`${appRoot.path}/`, '')
      };
    });
  const apps = getDirectories(`${appRoot.path}/app`)
    .filter((d) => {
      return true;
    })
    .map((d) => {
      return {
        files: allFilesInDir(d),
        type: 'app',
        name: `app-${d.replace(`${appRoot.path}/app/`, '')}`,
        implicitDependencies: [],
        root: d.replace(`${appRoot.path}/`, '')
      };
    });

  const projects: any = [...apis, ...libs, ...apps];
  return projects;
}

function minus(a: string[], b: string[]): string[] {
  const res = [];
  a.forEach((aa) => {
    if (!b.find((bb) => bb === aa)) {
      res.push(aa);
    }
  });
  return res;
}

export function readAngularJson(): any {
  return readJsonFile(`${appRoot.path}/projects.json`);
}

export function readNxJson(): any {
  const config = readJsonFile(`${appRoot.path}/nx.json`);
  if (!config.npmScope) {
    throw new Error(`nx.json must define the npmScope property.`);
  }
  return config;
}

export const getAffected = (affectedNamesFetcher: AffectedFetcher) => (touchedFiles: string[]): string[] => {
  const projects = getProjectNodes();
  return affectedNamesFetcher(projects, (f) => fs.readFileSync(`${appRoot.path}/${f}`, 'utf-8'), touchedFiles);
};

export function getAffectedProjectsWithTarget(target: string) {
  return getAffected(affectedProjectNamesWithTarget(target));
}
export const getAffectedApps = getAffected(affectedAppNames);
export const getAffectedProjects = getAffected(affectedProjectNames);
export const getAffectedLibs = getAffected(affectedLibNames);

export function getTouchedProjects(touchedFiles: string[]): string[] {
  const projects = getProjectNodes();
  return touchedProjects(projects, touchedFiles).filter((p) => !!p);
}

export function getAllAppNames() {
  const projects = getProjectNodes();
  return projects.filter((p) => p.type === ProjectType.app).map((p) => p.name);
}

export function getAllLibNames() {
  const projects = getProjectNodes();
  return projects.filter((p) => p.type === ProjectType.lib).map((p) => p.name);
}

export function getAllProjectNamesWithTarget(target: string) {
  const projects = getProjectNodes();
  return projects.filter((p) => p.architect[target]).map((p) => p.name);
}

export function getAllProjectNames() {
  const projects = getProjectNodes();
  return projects.map((p) => p.name);
}

export function getProjectRoots(projectNames: string[]): string[] {
  const projects = getProjectNodes();
  return projectNames.map((name) => path.dirname(projects.filter((p) => p.name === name)[0].root));
}

export function allFilesInDir(dirName: string): string[] {
  // Ignore files in nested node_modules directories
  if (dirName.endsWith('node_modules')) {
    return [];
  }

  let res = [];
  try {
    fs.readdirSync(dirName).forEach((c) => {
      const child = path.join(dirName, c);
      try {
        if (!fs.statSync(child).isDirectory()) {
          if (child.indexOf('.spec.ts') < 0) {
            // add starting with "apps/myapp/..." or "libs/mylib/..."
            res.push(normalizePath(child.substring(appRoot.path.length + 1)));
          }
        } else if (fs.statSync(child).isDirectory()) {
          if (child.indexOf('/mocks') >= 0) {
            res = [...res, ...[]];
          } else {
            res = [...res, ...allFilesInDir(child)];
          }
        }
      } catch (e) {
        //nop
      }
    });
  } catch (e) {
    //nop
  }
  return res;
}

export function readDependencies(projectNodes: ProjectNode[]): { [projectName: string]: Dependency[] } {
  const m = lastModifiedAmongProjectFiles();
  if (!directoryExists(`${appRoot.path}/dist`)) {
    fs.mkdirSync(`${appRoot.path}/dist`);
  }
  if (!fileExists(`${appRoot.path}/dist/nxdeps.json`) || m > mtime(`${appRoot.path}/dist/nxdeps.json`)) {
    const deps = dependencies(projectNodes, (f) => fs.readFileSync(`${appRoot.path}/${f}`, 'UTF-8'));
    fs.writeFileSync(`${appRoot.path}/dist/nxdeps.json`, JSON.stringify(deps, null, 2), 'UTF-8');
    return deps;
  } else {
    return readJsonFile(`${appRoot.path}/dist/nxdeps.json`);
  }
}

export function readDepGraph(): DepGraph {
  const projectNodes = getProjectNodes();
  return {
    npmScope: '',
    projects: projectNodes,
    deps: readDependencies(projectNodes)
  };
}

export function lastModifiedAmongProjectFiles() {
  return [
    recursiveMtime(`${appRoot.path}/libs`),
    recursiveMtime(`${appRoot.path}/apps`),
    mtime(`${appRoot.path}/angular.json`),
    mtime(`${appRoot.path}/nx.json`),
    mtime(`${appRoot.path}/tslint.json`),
    mtime(`${appRoot.path}/package.json`)
  ].reduce((a, b) => (a > b ? a : b), 0);
}

function recursiveMtime(dirName: string) {
  let res = mtime(dirName);
  fs.readdirSync(dirName).forEach((c) => {
    const child = path.join(dirName, c);
    try {
      if (!fs.statSync(child).isDirectory()) {
        const c = mtime(child);
        if (c > res) {
          res = c;
        }
      } else if (fs.statSync(child).isDirectory()) {
        const c = recursiveMtime(child);
        if (c > res) {
          res = c;
        }
      }
    } catch (e) {
      //nop
    }
  });
  return res;
}

function mtime(f: string): number {
  let fd = fs.openSync(f, 'r');
  try {
    return fs.fstatSync(fd).mtime.getTime();
  } finally {
    fs.closeSync(fd);
  }
}

function normalizePath(file: string): string {
  return file.split(path.sep).join('/');
}

function directoryExists(filePath: string): boolean {
  try {
    return statSync(filePath).isDirectory();
  } catch (err) {
    return false;
  }
}

function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

export function normalizedProjectRoot(p: ProjectNode): string {
  return p.root
    .split('/')
    .filter((v) => !!v)
    .slice(1)
    .join('/');
}
