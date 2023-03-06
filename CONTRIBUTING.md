# Documentation
This project uses [JSDoc](https://jsdoc.app/) to generate documentation. If you
want to help but don't have any ideas, you can help by improving the
documentation

# Building

## Setup
1. [Clone](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls)
the repository on your computer. This will download a copy of the repository to your computerthat you can edit.
2. Install [Node.js](https://nodejs.org/en/download/)
3. Open a terminal in the repository folder and run `npm install` to install the
dependencies.

## Minifying
Open a terminal in the repository folder and run `npm run min` to minify the
[main.js](main.js) file

## Documentation
Open a terminal in the repository folder and run `npm run docs` to generate the
documentation

## Release
Open a terminal in the repository folder and run `npm version` to generate a new
release. This will automatically update the version number in the
[package.json](package.json) file and generate a new commit and tag

Then, go to the [Releases](https://github.com/thelegendski/ski.js/releases)
page and create a new release. The tag should be the same as the version number
in the [package.json](package.json) file.
