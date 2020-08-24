#!/usr/bin/env node
const { init } = require('./index');

init();

/*const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const pjson = require("./../package.json");

const projectName = process.argv[2]
let stylesheet = 'css';
let jqueryDisabled = false;
let template;

const createScripts = () => {
    const scripts = `"start": "live-server"`

    return scripts;
}

const createDeps = ( deps ) => {
    let depsArray = Object.entries(deps)
        .map(( dep ) => `${ dep[0] }@${ dep[1] }`)
        .toString()
        .replace(/,/g, " ")
        .replace(/^/g, "")
        .replace(/fs-extra[^\s]+/g, "");

    if (jqueryDisabled) {
        depsArray = depsArray.replace(/jquery[@^.0-9]*!/g, "");
    }

    return depsArray;
}

const flagInitial = ( key ) => {
    if (key.match(/^--styles=(css|scss)$/)) {
        const regexp = /scss/
        stylesheet = regexp.test(key) ? 'scss' : 'css';
    }

    if (key.match(/^--disable-jquery=true$/)) {
        jqueryDisabled = true;
    }
}

if (process.argv[3]) {
    flagInitial(process.argv[3]);
}

if (process.argv[4]) {
    flagInitial(process.argv[4]);
}

console.log('Your settings:')
console.log('Disable jquery:', jqueryDisabled)
console.log('Stylesheet:', stylesheet);
console.log("\n\nStarted initializing project...");
exec(

        exec(
            `cd ${ projectName } && npm i -S ${ deps } && npm i -D ${ devDeps }`,
            async ( npmErr, npmStdout, npmStderr ) => {
                if (npmErr) {
                    console.error(`Some error while installing dependencies: ${ npmErr }`);
                    return;
                }
                console.log(npmStdout);
                console.log("Dependencies installed");

                console.log("Copying additional files...");
                try {
                    if (stylesheet === 'css') {
                        await fs.copy(
                            path.join(__dirname, "../simple-template/styles/css_style.css"),
                            `${ projectName }/styles/style.css`
                        );
                    } else {
                        await fs.copy(
                            path.join(__dirname, "../simple-template/styles/scss_style.scss"),
                            `${ projectName }/styles/style.scss`
                        );
                    }

                    await fs.copy(
                        path.join(__dirname, "../simple-template/index.html"),
                        `${ projectName }/index.html`
                    );
                    await fs.copy(
                        path.join(__dirname, "../simple-template/server/server.php"),
                        `${ projectName }/server/server.php`
                    );
                    await fs.copy(
                        path.join(__dirname, "../simple-template/js/script.js"),
                        `${ projectName }/js/script.js`
                    );
                    await fs.copy(
                        path.join(__dirname, "../simple-template/assets/logo.png"),
                        `${ projectName }/assets/logo.png`
                    );
                } catch (e) {
                    console.error(e)
                }

                console.log(
                    `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${ projectName }\nnpm start`
                )
            }
        );
    }
);*/
