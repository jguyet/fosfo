# fosfo
Petite Librairie javascript pour jeu vidéo avec canvas
<br>
<h2>Presentation :</h2>
![img](./img.gif)
<br>
<h2>Documentation :</h2><br>

<h3>function loadimage(url) :</h3>
fosfo.loadimage preload vos images avant de démarrer votre programme ou jeu.
<br>
Un callback de retour et conceillier en utilisation pour attendre les chargements d'images
<br>
<br>
Exemple :<br>
<code>fosfo.loadimage("niam.png");</code><br>
<code>fosfo.loadimage(["niam.png", "niam2.png"]).done(</code><br>
<code>	function(){</code><br>
<code>		//chargement terminé</code><br>
<code>	}</code><br>
<code>);</code>
<br>
<h3>function setFramesToImg(url, framewith, frameheight) :</h3>
fosfo.setFramesToImg indique a l'image d'url qu'il y a plusieurs parties d'images,
ce qui permet de pouvoir ensuite utilisé <b>fosfo.drawframe</b>.
<br>
url c'est l'url d'une image déja charger dans fosfo.
<br>
framewith correspond au nombre d'images en ligne.
<br>
frameheight correspond au nombre d'images sur la hauteur.
<br>
<br>
Exemple :<br>
<code>fosfo.drawframe("niam.png", 6, 4);</code><br>

