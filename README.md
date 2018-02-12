# MomPop Game examples

Welcome to the [HTML5 Games: Novice to Ninja](https://www.sitepoint.com/premium/books/html5games1) code examples.

Each can be run by opening the `index-native.html` file in your browser. This uses JavaScript native modules: so if you are running chrome you need to serve them from a web browser (because they have to be loaded via `http://` and not `file://...`).

```
npm install
npm start
```

will run a server on http://localhost:9966/ and links to all the `index-native.html` files.

If your browser doesn't yet support native modules, each example also has its own `package.json` file. For *every* example you will have to

```
npm install
npm start
```

And the example will be transpiled with Babel into old days JavaScript, with a running server on port 9966 by default.


## Building an example

Each example package also includes a `npm run build` command that will transpile the JavaScript into a single file `build.js` that can be run with the included `index.html` file, and deployed to servers etc.


## Missing examples

I'm organizing the code for each chapter. Still remaining:

```
ch06/*
ch07/*
ch08/*
ch09/*
```
