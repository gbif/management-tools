# management-tools
Tools for data managers of GBIF.org

This project is a collection of utilities for data managers inside and outside of the GBIF Secretariat.  The tools help managers prioritise effort by providing an overview and also triggering actions such as crawling or deletion of overcrawled data.

These tools target users who are familiar with the GBIF data management processes and standards, including experts throughout the GBIF network.  The toolset aims to include:

  1. The current running crawls monitor (replacing https://crawler.gbif.org)
  2. The summary of over crawled datasets
  3. The IPT synchronisation state for any IPT
  4. The synchronisation state of a Living Atlas when run as a gateway for publishign to GBIF (e.g. Oz, UK)
  5. The crawl history of a dataset 
  6. The crawl logs (ELK)


## Running the project

### Requirement Node 6+ && NPM 3+
This generator is targeted to be used with Node >= 6.0.0 and NPM => 3.0.0. You can check your version number with the command
```
node --version && npm --version
```

### install
```
npm install
npm run serve
```

Other options 

* `npm install` to install the dependencies
* `npm run build` to build an optimized version of your application in /dist
* `npm run serve` to launch a browser sync server on your source files
* `npm run serve:dist` to launch a server on your optimized application
* `npm run test` to launch your unit tests with Karma
* `npm run test:auto` to launch your unit tests with Karma in watch mode

## Code
The project is generated with [Yeoman](http://yeoman.io/generators/) and [generator-fountain-webapp](https://github.com/FountainJS/generator-fountain-webapp/tree/e37f2ad97e354f410f14995650284ea24b5f7bf3)

It is using npm and webpack to handle dependencies
[Angular 1](https://angularjs.org/) as framework
[Angular Material](https://material.angularjs.org/latest/) as ui components

## Project structure
The structure of the project is as decided by the generator. You can read more about the reasoning on [generator-fountain-webapp](https://github.com/FountainJS/generator-fountain-webapp/tree/e37f2ad97e354f410f14995650284ea24b5f7bf3)

## Issues and contributions
If you see any issues please do report them.

If it has to do with the build, then it is best directed at [generator-fountain-webapp](https://github.com/FountainJS/generator-fountain-webapp/tree/e37f2ad97e354f410f14995650284ea24b5f7bf3)
If it has to do with browser compatability, component functionality or visuals then it is best directed at Angular and Angular Material. They are all nice communities that accepts pull requests.

The project is more or less as generated, but with a few added libraries and a minimum of styling. There is no ambitions to do any styling beyond what is provided by the libraries.

Ideas is also welcomed

## Libraries of interest when developing new tools

* [Lodash](https://lodash.com/docs/4.17.4) : useful utilities
* [Angular](https://angularjs.org/)
* [Angular material](https://material.angularjs.org/1.1.5/) : ui components a la autocomplete
* [Moment JS](https://momentjs.com/) : formatting dates
* [Angular Moment](https://github.com/urish/angular-moment)
* [async](https://caolan.github.io/async/docs.html) : for making tons of async calls
* [Marked](https://www.npmjs.com/package/marked) : rendering markdwon
