# Create Web Lab [![GitHub stars][stars-shield]][stars-url] [![GitHub issues][issues-shield]][issues-url] [![GitHub][license-shield]][license-url] ![GitHub repo size](https://img.shields.io/github/repo-size/burevestnik-png/create-web-lab) ![GitHub last commit](https://img.shields.io/github/last-commit/burevestnik-png/create-web-lab)

Create first web lab with no build configuration.

Create Web Lab works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/burevestnik-png/create-web-lab/issues/new).<br>

## Documentation

### Quick review
To create a new lab, you may choose one of the following methods:

#### npx

```shell script
npx create-web-lab my-lab
```
_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a package runner tool that comes with npm 5.2+ and higher)_

#### npm

```shell script
npm i -g create-web-lab
create-web-lab my-lab
```

_(But I wouldn't recommend this method, keep calm and use npx)_

It will create a directory called `my-lab` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-lab
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── index.html
├── assets
│   ├── favicon.ico
│   └── logo.png
├── server
│   └── server.php
├── js
│   └── script.js
└── style
    └── style.(css|scss)
```

No configuration or complicated folder structures, only the files you need to build your app.

## Templates
If you run ```create-web-lab -h``` in terminal, you will recognise, that there several templates, on which you
can build your lab:
- **Simple template** (no keys)
- **Webpack template** (key: -w) (IN PROCESS)
- **Typescript template** based on webpack (key: -t) (IN PROCESS)

Also, during making your app you will be asked questions:
- Do you want to add **Jquery** to template
- What styles do you want to use (now only **CSS** and **SCSS**)

### Simple template based on CSS
To make it, run (also choose CSS as default style):
```shell script
npx create-web-lab my-lab
```

#### Project structure
```
my-lab
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── index.html
├── assets
│   ├── favicon.ico
│   └── logo.png
├── server
│   └── server.php
├── js
│   └── script.png
└── style
    └── style.css
```

#### Available Scripts

In the project directory, you can run:

##### `npm start`

Runs the app in the development mode. <br>
Your lab will automatically open in your default browser. <br>

#### Development
Learn more [here](https://github.com/burevestnik-png/create-web-lab#only-for-simple-css-template)

### Simple template based on SCSS
To make it, run (also choose SCSS as default style):
```shell script
npx create-web-lab my-lab
```

#### Project structure
```
my-lab
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── index.html
├── assets
│   ├── favicon.ico
│   └── logo.png
├── server
│   └── server.php
├── js
│   └── script.png
└── style
    └── style.scss
```

#### Available Scripts

In the project directory, you can run:

##### `npm start`

Runs the app in the development mode. <br>
Your lab will automatically open in your default browser. <br>

##### `npm run sass`

Compile default sass file to css.

#### Development
Learn more [here](https://github.com/burevestnik-png/create-web-lab#only-for-simple-scss-template)

## Pay attention to development feature
I'll describe you how to develop your lab using PhpStorm. <br>

### Only for [simple CSS template](https://github.com/burevestnik-png/create-web-lab#simple-template-based-on-css)
If you run app using ```npm start```, notice that php script wouldn't work. That's because live-server, which
is installed as devDependency can't work with php, but it is **especially good to make up front-end of your lab**. <br>
When your front will be ready, to check working capacity of your back-end you will need to use **built in PhpStorm
local server** (go to ```index.html``` file and in the right top you will see bar with browsers). Also, you need
to **configure php in PhpStorm**.

### Only for [simple SCSS template](https://github.com/burevestnik-png/create-web-lab#simple-template-based-on-scss)
If you run app using ```npm start```, notice that php script wouldn't work. That's because live-server, which
is installed as devDependency can't work with php, but it is **especially good to make up front-end of your lab**. <br>
When your front will be ready, to check working capacity of your back-end you will need to use **built in PhpStorm
local server** (go to ```index.html``` file and in the right top you will see bar with browsers). Also, you need
to **configure php in PhpStorm**. <br>
**Before checking php scripts you should run ```npm run sass```** to compile your SCSS file to CSS.


[stars-shield]: https://img.shields.io/github/stars/burevestnik-png/create-web-lab?style=social
[stars-url]: https://github.com/burevestnik-png/create-web-lab/stargazers
[issues-shield]: https://img.shields.io/github/issues/burevestnik-png/create-web-lab
[issues-url]: https://github.com/burevestnik-png/create-web-lab/issues
[license-shield]: https://img.shields.io/github/license/burevestnik-png/create-web-lab
[license-url]: https://github.com/burevestnik-png/create-web-lab/blob/master/LICENSE
