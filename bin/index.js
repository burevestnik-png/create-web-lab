"use strict";

const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");
const chalk = require('chalk');
const os = require('os');
const { Command } = require('commander');

const packageJson = require('../package.json');

let projectName;

function init() {
    const program = new Command(packageJson.name)
        .version(packageJson.version)
        .arguments('<project-directory>')
        .usage(`${ chalk.green('<project-directory>') } [options]`)
        .action(name => projectName = name)
        .option('-j, --disable-jquery', 'Deleting jQuery from dependencies')
        .option('-s, --style <type>', 'Enabling another stylesheet', 'css')
        .parse(process.argv);

    createWebLab(
        projectName,
        program.disableJquery,
        program.style
    )
}

function createWebLab(
    name,
    disableJquery,
    style
) {
    const root = path.resolve(name);
    const appName = path.basename(root);

    console.log(`Creating a new Web lab in ${chalk.green(root)}.`)
    console.log()

    fs.ensureDirSync(name);

    const packageJson = {
        name: appName,
        version: '0.1.0',
        private: true,
    };

    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );

    const originalDirectory = process.cwd();
    process.chdir(root);
}

module.exports = {
    init
};

