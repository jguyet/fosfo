<img width="100" src="./img/logo.png"/>

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![license][license-image]][license-url]
[![Join the chat at https://gitter.im/fosfo0/community](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fosfo0/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Petite Librairie javascript pour créer des jeux vidéo en canvas

## Demo :
example.html
<img src="./img/img.gif"/>

## Installation :

Manually pure Javascript :

````html
<html>
<head>
	<script src="./fosfo.js"></script>
</head>
<body></body>
</html>
````

With npm package manager :

````shell
$ npm install fosfo
````

````js
const Fosfo = require("fosfo");

let canvas = document.getElementById("cv");
new Fosfo(canvas)
````

With nodejs :

````shell
$ npm install canvas
$ npm install fosfo
````

````js
const { createCanvas, loadImage } = require('canvas');
const Fosfo = require("fosfo");

const canvas = createCanvas(200, 200); // nodejs create canvas

let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./niam.png"], loadImage).done(() => {
    // chargement terminé
    fosfo.draw('test', 'niam.png', 50, 50);
    fosfo.update();
    console.log(fosfo.toDataURL()); // getting blob url of canvas generated image
});
````

## Documentation :
#### Preload images :
`fosfo.loadimage` permet de charger vos images avant de démarrer votre programme.
##### Example :
````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
});
````

#### My First display :
`fosfo.draw` permet d'ajouter une image sur le canvas
##### Example :

````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	fosfo.draw("name", "miam.png", 50, 50); // fosfo.draw( nom, filename, x, y);
	fosfo.update(); // paint canvas with drawed object
});
````

#### Get blob :
`fosfo.toDataURL()` get blob url from canvas
##### Example :

````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	fosfo.draw("name", "miam.png", 50, 50); // fosfo.draw( nom, filename, x, y);
	fosfo.update(); // paint canvas with drawed object
	console.log(fosfo.toDataURL());
});
````

#### Clear one img :
`fosfo.undraw(name of draw image)` clear one or multiple drawed images
##### Example :

````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
	// chargement terminé
	fosfo.undraw("name");
	// or
	fosfo.undraw(["name", "name2"]);
	fosfo.draw("name", "miam.png", 50, 50); // fosfo.draw( nom, filename, x, y);
	fosfo.update(); // paint canvas with drawed object
});
````


#### Clear canvas :
`fosfo.clear()` clear all canvas drawed images
##### Example :

````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	fosfo.draw("name", "miam.png", 50, 50); // fosfo.draw( nom, filename, x, y);
	fosfo.update(); // paint canvas with drawed object
	fosfo.clear(); // fosfo canvas are totally cleaned
});
````

#### Sprite animation :
`fosfo.setFramesToImg` applique sur une image une grille de sprite qui permet l'usage de la fonction <b>fosfo.drawframe</b> pour afficher un sprite en particulier.
##### Example :

###### Assets :
<img src="./test/assets/niam.png"/><br>

````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	fosfo.setFramesToImg('niam.png', 6, 4);
	fosfo.drawframe("miam1", "niam.png", 6, 4);
	fosfo.update(); // paint canvas with drawed object
});
````

#### Display loop :
Loop display with Fosfo
##### Example :
````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);

let loopFunction = () => {
	//TODO future code
	fosfo.draw("name", "miam.png", 50, 50);
	fosfo.update(); // paint canvas with drawed object
};

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	setInterval(loopFunction, fosfo.fps / 1000); // appelle la fonction loopFunction 60 fois par seconde par defaut.
});
````

#### Display loop with moving & sprite animation :

##### Example :
````js
let canvas = document.getElementById("cv");
let fosfo = new Fosfo(canvas);
let count = 0;

let loopFunction = () => {
	//TODO future code
	let anims = [6, 7, 8, 9, 10, 11];
	
	fosfo.undraw("chatonfou");
	fosfo.drawframe("chatonfou", 'niam.png', anims[count], 250, 60);
	
	count += 1;
	if (count >= anims.length) count = 0;

	fosfo.update(); // paint canvas with drawed object
};

fosfo.loadimage(["./assets/niam.png", "./assets/niam2.png"]).done(() => {
    // chargement terminé
	setInterval(loopFunction, fosfo.fps / 1000); // appelle la fonction loopFunction 60 fois par seconde par defaut.
});
````

[npm-image]: https://img.shields.io/npm/v/fosfo.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fosfo
[travis-image]: https://api.travis-ci.com/jguyet/fosfo.svg?branch=master
[travis-url]: https://travis-ci.com/github/jguyet/fosfo
[license-image]: https://img.shields.io/npm/l/express.svg
[license-url]: https://tldrlegal.com/license/mit-license
