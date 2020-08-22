#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const https = require("https");
const { exec } = require("child_process");

const packageJson = require("../package.json");

const projectName = process.argv[2]
let stylesheet;
let template;

const createScripts = () => {
    const scripts = `"start": "live-server"`

    return scripts;
}

const createDeps = ( deps ) => {
    return Object.entries(deps)
        .map(( dep ) => `${ dep[0] }@${ dep[1] }`)
        .toString()
        .replace(/,/g, " ")
        .replace(/^/g, "")
        .replace(/fs-extra[^\s]+/g, "");
}

const getDependencies = ( dependencies ) =>
    Object.entries(dependencies)
        .map(( dep ) => `${ dep[0] }@${ dep[1] }`)
        .toString()
        .replace(/,/g, " ")
        .replace(/^/g, "")
        .replace(/fs-extra[^\s]+/g, "");

if (process.argv[3]) {
    if (process.argv[3].match(/^--styles=(css|scss)$/)) {
        const regexp = /scss/
        stylesheet = regexp.test(process.argv[3]) ? 'scss' : 'css';
        console.log(stylesheet);
    }
}

console.log("Started initializing project...");
exec(
    `mkdir ${ projectName } && cd ${ projectName } && npm init -f`,
    ( initErr, initStdout, initStderr ) => {
        if (initErr) {
            console.log(initErr)
            console.error(`Everything was fine, then it wasn't (probably such directory already exists): 
            ${ initErr }`);
            return;
        }

        const packageJSON = `${ projectName }/package.json`;
        fs.readFile(
            packageJSON,
            ( error, file ) => {
                if (error) throw error;
                const data = file
                    .toString()
                    .replace(
                        '"test": "echo \\"Error: no test specified\\" && exit 1"',
                        createScripts()
                    );
                fs.writeFile(
                    packageJSON,
                    data,
                    ( error2 ) => error2 || true);
            });

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
                        fs.writeFile(
                            `${ projectName }/.gitignore`,
                            body,
                            { encoding: "utf-8" },
                            ( err ) => {
                                if (err) throw err;
                            }
                        );
                    });
            }
        );
        console.log("npm init -> done\n");

        console.log("Installing deps -- it might take a few minutes...");
        const deps = getDependencies(packageJson.dependencies);
        exec(
            `cd ${ projectName } && npm i -S ${ deps }`,
            ( npmErr, npmStdout, npmStderr ) => {
                if (npmErr) {
                    console.error(`Some error while installing dependencies: ${ npmErr }`);
                    return;
                }
                console.log(npmStdout);
                console.log("Dependencies installed");

                console.log("Copying additional files...");
                fs.copy(path.join(__dirname, "../simple-template/index.html"), `${ projectName }/index.html`)
                    .then(() =>
                        console.log(
                            `All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${ projectName }\nnpm start`
                        )
                    )
                    .catch(( err ) => console.error(err));
            }
        );
    }
);
