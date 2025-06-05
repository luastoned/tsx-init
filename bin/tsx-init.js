#!/usr/bin/env node

// src/tsx-init.ts
var import_node_child_process = require("node:child_process");
var import_promises = require("node:fs/promises");
var dependencies = ["std-kit"];
var devDependencies = ["@biomejs/biome", "@types/node", "esbuild", "tsx", "typescript"];
var appTsContent = `const runApp = async () => {
  console.log('Hello World');
}

runApp().catch((error) => console.log('Error', error));`;
var execPromise = (command) => {
  return new Promise((resolve, reject) => {
    (0, import_node_child_process.exec)(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
      }
      resolve(stdout);
    });
  });
};
var addYarn = async () => {
  const yarnCheck = await execPromise("yarn --version").catch(() => null);
  if (!yarnCheck) return false;
  await execPromise(`yarn add ${dependencies.join(" ")}`).catch(() => null);
  await execPromise(`yarn add --dev ${devDependencies.join(" ")}`).catch(() => null);
  return true;
};
var addNpm = async () => {
  const npmCheck = await execPromise("npm --version").catch(() => null);
  if (!npmCheck) return false;
  await execPromise(`npm install ${dependencies.join(" ")}`).catch(() => null);
  await execPromise(`npm install --save-dev ${devDependencies.join(" ")}`).catch(() => null);
  return true;
};
var addPnpm = async () => {
  const pnpmCheck = await execPromise("pnpm --version").catch(() => null);
  if (!pnpmCheck) return false;
  await execPromise(`pnpm add ${dependencies.join(" ")}`).catch(() => null);
  await execPromise(`pnpm add --dev ${devDependencies.join(" ")}`).catch(() => null);
  return true;
};
var runApp = async () => {
  const packageJson = await (0, import_promises.readFile)("package.json", "utf-8").then((data) => JSON.parse(data)).catch((error) => console.log("- package.json not found"));
  if (!packageJson) {
    console.log("- please run npm/yarn init before running tsx-init");
    return;
  }
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.start = "tsx src/app.ts";
  packageJson.scripts.dev = "tsx watch src/app.ts";
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }
  await (0, import_promises.writeFile)("package.json", JSON.stringify(packageJson, null, 2));
  const yarnLock = await (0, import_promises.stat)("yarn.lock").catch(() => null);
  if (yarnLock) {
    await addYarn();
    console.log("+ added dependencies with yarn");
  }
  const npmLock = await (0, import_promises.stat)("package-lock.json").catch(() => null);
  if (npmLock) {
    await addNpm();
    console.log("+ added dependencies with npm");
  }
  const pnpmLock = await (0, import_promises.stat)("pnpm-lock.yaml").catch(() => null);
  if (pnpmLock) {
    await addPnpm();
    console.log("+ added dependencies with pnpm");
  }
  if (!yarnLock && !npmLock && !pnpmLock) {
    await addYarn();
    console.log("+ added dependencies with yarn");
  }
  await (0, import_promises.mkdir)("src").then(() => console.log("+ created directory src/")).catch((error) => console.log("- directory src/ already exists"));
  const appFile = await (0, import_promises.stat)("src/app.ts").catch(() => null);
  if (!appFile) {
    await (0, import_promises.writeFile)("src/app.ts", appTsContent).then(() => console.log("+ created file src/app.ts")).catch((error) => console.log("- error writing src/app.ts", error));
  } else {
    console.log("- file src/app.ts already exists");
  }
};
runApp().catch((error) => console.log("Error", error));
