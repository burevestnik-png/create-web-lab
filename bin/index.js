"use strict";

const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");
const chalk = require('chalk');
const os = require('os');
const { Command } = require('commander');
const inquirer = require('inquirer');

const packageJson = require('../package.json');

let projectName;

const questions = [
    {
        type: 'list',
        name: 'style',
        message: 'Choose your styles template:',
        choices: [ 'CSS', 'SCSS' ]
    },
    {
        type: 'confirm',
        name: 'enableJquery',
        message: 'Do you need jquery?',
        default: false
    }
]

async function init() {
    const program = new Command(packageJson.name)
        .version(packageJson.version)
        .arguments('<project-directory>')
        .usage(`${ chalk.green('<project-directory>') } [options]`)
        .action(name => projectName = name)
        .option('-w, --enable-webpack', 'Adding webpack config to your project')
        .option('-t, --typescript', 'Enabling typescript (will init project with webpack config)')
        .parse(process.argv);

    const result = await inquirer.prompt(questions)
    console.log();
    console.log('Your settings:');
    console.log(
        `${ chalk.cyan('Project name:') } ${ projectName }`
    )
    console.log(
        `${ chalk.cyan('Styles:') } ${ result.style }`
    )
    console.log(
        `${ chalk.cyan('Enable jquery:') } ${ result.enableJquery }`
    )
    console.log(
        `${ chalk.cyan('Enable webpack:') } ${ (!!program.enableWebpack) }`
    )
    console.log(
        `${ chalk.cyan('Enable typescript:') } ${ !!program.typescript }`
    )
    console.log();
    console.log();

    createWebLab(
        projectName,
        result.enableJquery,
        result.style,
        !!program.enableWebpack,
        !!program.typescript
    )
}

function createWebLab(
    name,
    enableJquery,
    style,
    enableWebpack,
    enableTypescript
) {
    const root = path.resolve(name);
    const appName = path.basename(root);

    console.log(`Creating a new Web lab in ${ chalk.green(root) }.`)
    console.log()

    fs.ensureDirSync(name);

    const packageJson = {
        name: appName,
        version: '1.0.0',
        private: true,
        description: "Project was initialized with create-web-lab",
        dependencies: {},
        devDependencies: {},
        scripts: createScripts(enableWebpack, enableTypescript)
    };

    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );

    process.chdir(root);

    if (!enableTypescript && !enableWebpack) {
        console.log(`${ chalk.yellow('Installing dependencies -- it might take a few minutes...') }`);
        console.log()
        if (enableJquery) installPackage('jquery', false)
        installPackage('live-server');

        console.log()
        console.log(`${ chalk.yellow('Perfect! All dependencies installed, now let\'s install template from npm server:)') }`);


        console.log();
        console.log(
            `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${ projectName }\nnpm start`
        )
    }

    /* https.get(
         "https://raw.githubusercontent.com/burevestnik-png/create-web-lab/master/.gitignore",
         ( response ) => {
             response.setEncoding("utf8");
             let body = "";
             response.on(
                 "data",
                 ( data ) => {
                     body += data;
                 });
             response.on(
                 "end",
                 () => {
                     fs.writeFile(
                         `${ projectName } /).gitignore`,
                         body,
                         { encoding: "utf-8" },
                         ( err ) => {
                             if (err) throw err;
                         }
                     );
                 });
         }
     );*/
}

const createScripts = (
    enableWebpack,
    enableTypescript
) => {
    if (!enableTypescript && !enableWebpack) {
        return {
            start: "live-server"
        }
    }
}

const installPackage = ( packageName, isDev = true ) => {
    exec(
        `
        npm i ${ packageName } ${ isDev ? '-D' : '-S' }`,
        ( npmErr, npmStdout, npmStderr ) => {
            if (npmErr) {
                console.error(`${ chalk.red('Caught error while installing dependencies:') }`)
                console.log()
                console.log(`${ chalk.red(npmErr) }`);
                return;
            }
            console.log(`${ chalk.yellow(npmStdout) }`);
        }
    )
}

module.exports = {
    init
};

