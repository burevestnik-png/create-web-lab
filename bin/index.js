"use strict";

const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const util = require('util');
const exec = util.promisify(require('child_process').exec);
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

    await createWebLab(
        projectName,
        result.enableJquery,
        result.style,
        !!program.enableWebpack,
        !!program.typescript
    )
}

async function createWebLab(
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
    console.log(chalk.green('package.json was initialized successfully'));
    console.log()

    process.chdir(root);

    if (!enableTypescript && !enableWebpack) {
        console.log(`${ chalk.yellow('Installing dependencies -- it might take a few minutes...') }`);
        console.log()
        if (enableJquery) await installPackage('jquery', false)
        await installPackage('live-server');

        console.log(`${ chalk.green('Perfect! All dependencies installed, now let\'s copy template from npm server:') }`);
        console.log()

        console.log(chalk.yellow('Copying .gitignore...'));
        getGitignore();

        try {
            await fs.copy(
                path.join(__dirname, "../simple-template/index.html"),
                `index.html`
            );
            console.log(chalk.yellow('Copying index.html...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/server/server.php"),
                `server/server.php`
            );
            console.log(chalk.yellow('Copying php script...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/js/script.js"),
                `js/script.js`
            );
            console.log(chalk.yellow('Copying Js script...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/assets/logo.png"),
                `assets/logo.png`
            );
            console.log(chalk.yellow('Copying assets...'));

            if (style === 'css') {
                await fs.copy(
                    path.join(__dirname, "../simple-template/styles/css_style.css"),
                    `styles/style.css`
                );
                console.log(chalk.yellow('Copying CSS styles...'));
            } else {
                await fs.copy(
                    path.join(__dirname, "../simple-template/styles/scss_style.scss"),
                    `styles/style.scss`
                );
                console.log(chalk.yellow('Copying SCSS styles...'));
            }
        } catch (e) {
            console.error(chalk.red(e));
        }

        console.log();
        console.log(chalk.green('All done! Your project is now ready.'));
        console.log(chalk.green('Use below command to run the app:'));
        console.log();
        console.log(chalk.cyan(`cd ${ projectName }`));
        console.log(chalk.cyan(`npm start`));
    }
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

const getGitignore = () => {
    https.get(
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
                    try {
                        fs.writeFileSync(
                            `.gitignore`,
                            body,
                            { encoding: "utf-8" }
                        );
                    } catch (e) {
                        console.error(chalk.red(e));
                    }
                });
        });
}

const installPackage = async ( packageName, isDev = true ) => {
    const { error, stdout } = await exec(`npm i ${ packageName } ${ isDev ? '-D' : '-S' }`);

    if (error) {
        console.error(`${ chalk.red('Caught error while installing dependencies:') }`)
        console.log()
        console.log(`${ chalk.red(error) }`);
        return
    }

    console.log(`${ chalk.yellow(stdout) }`);
}

module.exports = {
    init
};

