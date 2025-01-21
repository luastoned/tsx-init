#!/usr/bin/env node

import { stat, mkdir, readFile, writeFile } from 'node:fs/promises';

const appTsContent = `const runApp = async () => {
  console.log('Hello World');
}

runApp().catch((error) => console.log('Error', error));`;

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

  // create src directory
  await mkdir('src')
    .then(() => console.log('+ created directory src/'))
    .catch((error) => console.log('- directory src/ already exists'));

  // create src/app.ts
  if (await stat('src/app.ts').catch(() => null)) {
    console.log('- file src/app.ts already exists');
  } else {
    await writeFile('src/app.ts', appTsContent)
      .then(() => console.log('+ created file src/app.ts'))
      .catch((error) => console.log('- error writing src/app.ts', error));
  }

  console.log('> yarn add --dev @types/node esbuild tsx typescript');
};

runApp().catch((error) => console.log('Error', error));
