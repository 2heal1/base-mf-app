const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = function (/** @type {import('plop').NodePlopAPI} */ plop) {
  const port = nextPort();

  plop.setActionType("runCommand", function (answers, config, papi) {
    const cmd = papi.renderString(config.cmd, answers);
    const args = config?.args?.map((a) => papi.renderString(a, answers));
    const spawnOpts = {
      cwd: papi.renderString(config.path, answers),
      shell: config.verbose,
      stdio: config.verbose ? "inherit" : undefined,
    };

    const formattedCommand = [cmd, ...args].join(" ");
    return new Promise((resolve, reject) => {
      const command = spawn(cmd, args, spawnOpts);
      command.stdout.on("data", (data) => {});
      command.on("close", (code) =>
        code?.toString() === "0"
          ? resolve(`"${formattedCommand}" ran successfully`)
          : reject(`"${formattedCommand}" failed, exit code: ${code}`),
      );
    });
  });

  plop.setGenerator("app", {
    description:
      "generates a new MFE application.\
    The generator assumes the MFE host is at the same level of the generated remote",
    prompts: [
      {
        type: "input",
        name: "name",
        default: "my-app",
        message: "application name",
      },
      {
        type: "input",
        name: "host",
        default: ".",
        message: "host location (relative to apps)",
      },
    ],
    actions: function (data) {
      const hostConfigType = detectHostConfigType(`apps/${data.host}`);
      const mfeFullPathName =
        data.host === "." ? data.name : `${data.host}/${data.name}`;
      if (!hostConfigType) {
        return [
          {
            type: "add",
            path: "error.log",
            template: "No host config type found",
          },
        ];
      }

      return [
        {
          type: "addMany",
          base: `.templates/rsbuild/app/`,
          data: { nextPort: port, mfeFullPathName },
          destination: "apps/{{host}}/{{dashCase name}}/",
          templateFiles: [`.templates/rsbuild/app/**/*`],
          skipIfExists: true,
        },
        {
          type: "add",
          path: "apps/{{host}}/host/src/components/{{pascalCase name}}Remote/index.tsx",
          templateFile: `.templates/${hostConfigType}/host/RemoteComponent.tsx.hbs`,
        },
        {
          type: "append",
          path: "apps/{{host}}/host/src/routing/constants.ts",
          pattern: "// generated application prefix",
          template:
            'export const {{camelCase name}}RoutingPrefix = "{{dashCase name}}";',
        },
        {
          type: "append",
          path: "apps/{{host}}/host/src/routing/routes.tsx",
          pattern: "// injected routing prefix",
          template:
            'import { {{camelCase name}}RoutingPrefix } from "./constants";',
        },
        {
          type: "append",
          path: "apps/{{host}}/host/src/routing/routes.tsx",
          pattern: "// Lazy load remote applications",
          template:
            'const {{pascalCase name}}Lazy = lazy(() => import("../components/{{pascalCase name}}Remote"));',
        },
        {
          type: "append",
          path: "apps/{{host}}/host/src/routing/routes.tsx",
          pattern: "// Injecting Routes MFEs",
          template:
            "{ path: `/${ {{camelCase name}}RoutingPrefix}/*`, element:<MFENode><{{pascalCase name}}Lazy /></MFENode> },",
        },
        {
          type: "append",
          data: { nextPort: port },
          path: `apps/{{host}}/host/${hostConfigType}.config.ts`,
          pattern: "// remote application urls",
          templateFile: `.templates/${hostConfigType}/host/${hostConfigType}.dns.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port },
          path: `apps/{{host}}/host/versions.json`,
          pattern: '"dev": {',
          templateFile: `.templates/${hostConfigType}/host/versions.json.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port },
          path: `apps/{{host}}/host/versions.json`,
          pattern: '"staging": {',
          templateFile: `.templates/${hostConfigType}/host/versions.json.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port },
          path: `apps/{{host}}/host/versions.json`,
          pattern: '"production": {',
          templateFile: `.templates/${hostConfigType}/host/versions.json.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port, stage: "dev" },
          path: `apps/{{host}}/host/${hostConfigType}.config.ts`,
          pattern: "// app configurations for the 'dev' stage",
          templateFile: `.templates/${hostConfigType}/host/${hostConfigType}.domain.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port, stage: "staging" },
          path: `apps/{{host}}/host/${hostConfigType}.config.ts`,
          pattern: "// app configurations for the 'staging' stage",
          templateFile: `.templates/${hostConfigType}/host/${hostConfigType}.domain.hbs`,
        },
        {
          type: "append",
          data: { nextPort: port, stage: "production" },
          path: `apps/{{host}}/host/${hostConfigType}.config.ts`,
          pattern: "// app configurations for the 'production' stage",
          templateFile: `.templates/${hostConfigType}/host/${hostConfigType}.domain.hbs`,
        },
        {
          type: "append",
          path: `apps/{{host}}/host/${hostConfigType}.config.ts`,
          pattern: "remotes: {",
          template:
            '"{{kebabCase name}}": `{{snakeCase name}}@${ {{camelCase name}}Domain}/remoteEntry.js`,',
        },
        {
          type: "append",
          path: "apps/{{host}}/host/src/global.d.ts",
          pattern: "// generated declarations",
          templateFile: `.templates/${hostConfigType}/host/global.d.ts.hbs`,
        },
        {
          type: "runCommand",
          cmd: "yarn",
          args: [],
          path: "apps/{{host}}/{{dashCase name}}",
        },
        {
          type: "runCommand",
          cmd: "yarn",
          path: ".",
          args: [
            "prettier",
            "-w",
            "apps/{{host}}/{{dashCase name}}",
            "apps/{{host}}/host",
          ],
        },
      ];
    },
  });
};

/**
 * @param dirPath {string}
 * @param arrayOfFiles {string[]}
 * @returns {string[]}
 */
const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (file === "node_modules") return;
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

const getAllPackageJsonFiles = function (dirPath, arrayOfFiles) {
  return getAllFiles(dirPath, arrayOfFiles)
    .filter((file) => file.endsWith("package.json"))
    .map((f) => fs.readFileSync(f, { encoding: "utf-8" }))
    .map((f) => JSON.parse(f));
};

const nextPort = function () {
  try {
    const ports = getAllFiles("./apps")
      .filter((f) => f.endsWith("package.json"))
      .map((f) => fs.readFileSync(f, { encoding: "utf-8" }))
      .map(
        (f) => f.match(/PORT=(?<port1>[0-9]+)|--port (?<port2>[0-9]+)/)?.groups,
      )
      .map((groups) => groups?.port1 || groups?.port2)
      .filter((f) => f)
      .sort((a, b) => parseInt(b) - parseInt(a));
    return parseInt(ports[0]) + 1;
  } catch {
    return 3001;
  }
};

const detectHostConfigType = function (hostPath) {
  const basePath = process.cwd();
  const cracoConfigPath = path.join(basePath, hostPath, "craco.config.ts");
  const rsbuildConfigPath = path.join(basePath, hostPath, "rsbuild.config.ts");
  const cracoConfigPathWithHost = path.join(
    basePath,
    hostPath,
    "host",
    "craco.config.ts",
  );
  const rsbuildConfigPathWithHost = path.join(
    basePath,
    hostPath,
    "host",
    "rsbuild.config.ts",
  );

  if (
    fs.existsSync(cracoConfigPath) ||
    fs.existsSync(cracoConfigPathWithHost)
  ) {
    console.log("Found Craco config");
    return "craco";
  } else if (
    fs.existsSync(rsbuildConfigPath) ||
    fs.existsSync(rsbuildConfigPathWithHost)
  ) {
    console.log("Found rsbuild config");
    return "rsbuild";
  } else {
    console.log("No config found");
    return null;
  }
};
