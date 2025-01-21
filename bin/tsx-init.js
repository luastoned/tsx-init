#!/usr/bin/env node

// src/tsx-init.ts
var import_promises = require("node:fs/promises");
var appTsContent = `const runApp = async () => {
  console.log('Hello World');
}

runApp().catch((error) => console.log('Error', error));`;
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
  await (0, import_promises.mkdir)("src").then(() => console.log("+ created directory src/")).catch((error) => console.log("- directory src/ already exists"));
  if (await (0, import_promises.stat)("src/app.ts").catch(() => null)) {
    console.log("- file src/app.ts already exists");
  } else {
    await (0, import_promises.writeFile)("src/app.ts", appTsContent).then(() => console.log("+ created file src/app.ts")).catch((error) => console.log("- error writing src/app.ts", error));
  }
  console.log("> yarn add --dev @types/node esbuild tsx typescript");
};
runApp().catch((error) => console.log("Error", error));
