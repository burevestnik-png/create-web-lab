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
        `${ chalk.cyan('Project name:') }      ${ projectName }`
    )
    console.log(
        `${ chalk.cyan('Styles:') }            ${ result.style }`
    )
    console.log(
        `${ chalk.cyan('Enable jquery:') }     ${ result.enableJquery }`
    )
    console.log(
        `${ chalk.cyan('Enable webpack:') }    ${ (!!program.enableWebpack) }`
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
        scripts: createScripts(enableWebpack, enableTypescript, style)
    };

    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );
    console.log(chalk.green('package.json was initialized successfully'));
    console.log()

    process.chdir(root);

    if (!enableTypescript && !enableWebpack) {
        console.log(`${ chalk.yellow('Installing dependencies -- it will take a few minutes...') }`);
        console.log()
        await installDeps(enableWebpack, enableTypescript, enableJquery, style);

        console.log(`${ chalk.green('Perfect! All dependencies installed, now let\'s create template:') }`);
        console.log()

        console.log(chalk.yellow('Making .gitignore...'));
        getGitignore();

        await copySimpleTemplate(enableJquery, style);
        console.log(chalk.green('Template was made successfully'));

        createEnding();
    }
}

const createEnding = () => {
    console.log();
    console.log(chalk.green('All done! Your project is now ready.'));
    console.log(chalk.green('Use below command to run the app:'));
    console.log();
    console.log(chalk.cyan(`cd ${ projectName }`));
    console.log(chalk.cyan(`npm start`));
}

const installDeps = async (
    enableWebpack,
    enableTypescript,
    enableJquery,
    style
) => {
    if (!enableTypescript && !enableWebpack) {
        if (enableJquery) await installPackage('jquery', false)

        await installPackage('live-server');

        if (style === 'SCSS') {
            await installPackage('concurrently')
            await installPackage('sass')
        }
    }
}

const createScripts = (
    enableWebpack,
    enableTypescript,
    style
) => {
    if (!enableTypescript && !enableWebpack) {
        let scripts = {
            start: "live-server"
        };

        if (style === 'SCSS') {
            scripts = {
                start: "concurrently \"live-server\" \"sass --watch styles/style.scss styles/style.css\"",
                sass: "sass styles/style.scss styles/style.css"
            }
        }

        return scripts
    }
}

const copySimpleTemplate = async (
    enableJquery,
    style
) => {
    try {
        if (enableJquery) {
            await fs.copy(
                path.join(__dirname, "../simple-template/index_jquery.html"),
                `index.html`
            );
            console.log(chalk.yellow('Making index.html...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/js/script_jquery.js"),
                `js/script.js`
            );
            console.log(chalk.yellow('Making js/script.js...'));
        } else {
            await fs.copy(
                path.join(__dirname, "../simple-template/index.html"),
                `index.html`
            );
            console.log(chalk.yellow('Making index.html...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/js/script.js"),
                `js/script.js`
            );
            console.log(chalk.yellow('Making js/script.js...'));
        }

        await fs.copy(
            path.join(__dirname, "../simple-template/server/server.php"),
            `server/server.php`
        );
        console.log(chalk.yellow('Making server/server.php...'));

        await fs.copy(
            path.join(__dirname, "../simple-template/assets/logo.png"),
            `assets/logo.png`
        );
        await fs.copy(
            path.join(__dirname, "../simple-template/assets/favicon.ico"),
            `assets/favicon.ico`
        );
        console.log(chalk.yellow('Making assets...'));

        if (style === 'CSS') {
            await fs.copy(
                path.join(__dirname, "../simple-template/styles/css_style.css"),
                `styles/style.css`
            );
            console.log(chalk.yellow('Making CSS styles...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/readme/README_CSS.md"),
                `README.md`
            );
            console.log(chalk.yellow('Making README.md...'));
        } else {
            await fs.copy(
                path.join(__dirname, "../simple-template/styles/scss_style.scss"),
                `styles/style.scss`
            );
            console.log(chalk.yellow('Making SCSS styles...'));

            await fs.copy(
                path.join(__dirname, "../simple-template/readme/README_SCSS.md"),
                `README.md`
            );
            console.log(chalk.yellow('Making README.md...'));
        }
    } catch (e) {
        console.error(chalk.red(e));
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

