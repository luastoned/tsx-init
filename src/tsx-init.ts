#!/usr/bin/env node

import { exec } from 'node:child_process';
import { stat, mkdir, readFile, writeFile } from 'node:fs/promises';

const dependencies = ['std-kit'];
const devDependencies = ['@biomejs/biome', '@types/node', 'esbuild', 'tsx', 'typescript'];

const appTsContent = `const runApp = async () => {
  console.log('Hello World');
}

runApp().catch((error) => console.log('Error', error));`;

const execPromise = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      }

      // console.log(`stdout: ${stdout}`);
      // console.error(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
};

const addYarn = async () => {
  // check if yarn is installed
  const yarnCheck = await execPromise('yarn --version').catch(() => null);
  if (!yarnCheck) return false;

  // install dependencies
  await execPromise(`yarn add ${dependencies.join(' ')}`).catch(() => null);

  // install devDependencies
  await execPromise(`yarn add --dev ${devDependencies.join(' ')}`).catch(() => null);

  return true;
};

const addNpm = async () => {
  // check if npm is installed
  const npmCheck = await execPromise('npm --version').catch(() => null);
  if (!npmCheck) return false;

  // install dependencies
  await execPromise(`npm install ${dependencies.join(' ')}`).catch(() => null);

  // install devDependencies
  await execPromise(`npm install --save-dev ${devDependencies.join(' ')}`).catch(() => null);

  return true;
};

const addPnpm = async () => {
  // check if pnpm is installed
  const pnpmCheck = await execPromise('pnpm --version').catch(() => null);
  if (!pnpmCheck) return false;

  // install dependencies
  await execPromise(`pnpm add ${dependencies.join(' ')}`).catch(() => null);

  // install devDependencies
  await execPromise(`pnpm add --dev ${devDependencies.join(' ')}`).catch(() => null);

  return true;
};

const runApp = async () => {
  // read package.json
  const packageJson = await readFile('package.json', 'utf-8')
    .then((data) => JSON.parse(data))
    .catch((error) => console.log('- package.json not found'));

  if (!packageJson) {
    console.log('- please run npm/yarn init before running tsx-init');
    return;
  }

  // update scripts in package.json
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts.start = 'tsx src/app.ts';
  packageJson.scripts.dev = 'tsx watch src/app.ts';

  // update dependencies in package.json
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  // update devDependencies in package.json
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  await writeFile('package.json', JSON.stringify(packageJson, null, 2));

  // check if yarn.lock exists
  const yarnLock = await stat('yarn.lock').catch(() => null);
  if (yarnLock) {
    await addYarn();
    console.log('+ added dependencies with yarn');
  }

  const npmLock = await stat('package-lock.json').catch(() => null);
  if (npmLock) {
    await addNpm();
    console.log('+ added dependencies with npm');
  }

  const pnpmLock = await stat('pnpm-lock.yaml').catch(() => null);
  if (pnpmLock) {
    await addPnpm();
    console.log('+ added dependencies with pnpm');
  }

  if (!yarnLock && !npmLock && !pnpmLock) {
    await addYarn();
    console.log('+ added dependencies with yarn');
  }

  // create src directory
  await mkdir('src')
    .then(() => console.log('+ created directory src/'))
    .catch((error) => console.log('- directory src/ already exists'));

  // create src/app.ts file
  const appFile = await stat('src/app.ts').catch(() => null);
  if (!appFile) {
    await writeFile('src/app.ts', appTsContent)
      .then(() => console.log('+ created file src/app.ts'))
      .catch((error) => console.log('- error writing src/app.ts', error));
  } else {
    console.log('- file src/app.ts already exists');
  }
};

runApp().catch((error) => console.log('Error', error));
