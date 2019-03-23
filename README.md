# HTML5 Games: Novice to Ninja

![HTML5 Games](https://user-images.githubusercontent.com/129330/36218826-9cdf69a0-1183-11e8-9822-a92fdc6cd9ac.png)

Hello and thanks for checking out [HTML5 Games: Novice to Ninja](https://www.sitepoint.com/premium/books/html5games1)! These are the code examples for the book. If you are reading this then you are among the first people in the world getting your hands dirty. If you have issues running the examples, find any inconsistencies and errors, or you have suggestions then please either log an issue or email me at mrspeaker@gmail.com (or ping me @mrspeaker), I will try to help.

[Try the examples](https://spbooks.github.io/html5games1/).

They will run in all recent browsers - check out all the examples and play some of the games!

## Making your own games

To modify the code and make your own game you'll need to be able to run it. Each example also includes an npm `package.json` file for converting the code into a single file that can be run in any browser. For each example you need to run:

`npm install`

You only have to do this once per example. This installs all the dependencies and files needed to run and package your game. Use the command:

`npm start`

It will start a webserver (at the URL http://localhost:9966/ by default). You can test your changes at the URL.

## Building for the outside world

Once you've finished your game and are happy with your changes, you can run:

`npm run build`

Which will convert the code into a single `build.js` file that can be run with the included `index.html` file. These two files (along with any of your game assets and images) can then be deployed to a public server for everyone to play. If you make a game, please let me know on Twitter (@mrspeaker)!

## Getting help

Setting up a workable build system to run code can be the most frustrating aspect of JavaScript development. If you are having any trouble running or modifying the examples, either log an issue on the code repository, send me an email at mrspeaker@gmail.com, or ping me @mrspeaker on twitter - and we'll get it sorted.

## Using JavaScript Native Modules

Recently, most browsers have began to support [JavaScript Native Modules](). this means the step of converting all the code into a single file is not necessary - you can just make changes to your code and see the results without even needing npm.

(For Firefox before version 60 it's enabled behind the about:config `dom.moduleScripts.enabled` flag).

This is really convenient and cool - however, if you want to run your games locally on your own computer they still need to be served by a webserver. This is because JavaScript modules will only work via `http://` and not `file://` - so you can't just double-click and run it. There is a webserver in the **root directory** (that is, in `html5games1/`) that you can install and run (via `npm`) with:

```
npm install
npm start
```

This will run a server on http://localhost:9966/. If you browse here there will be links to each example.

## Examples to come

I'm organizing the code for each chapter. There's still a little tidying going on. Also, still remaining:

```
ch09/01-02,05-10
```
