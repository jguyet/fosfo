# fosfo
Petite Librairie javascript pour créer des jeux vidéo en canvas
<br>
<h2>Presentation :</h2>
<img src="./img/img.gif"/>
<br>
<h2>Installation :</h2><br>
<pre><script src="./fosfo.js"></script></pre><br>
<h2>Documentation :</h2><br>
<h3>function loadimage(url) :</h3>
fosfo.loadimage preload vos images avant de démarrer votre programme ou jeu.
<br>
Un callback de retour et conceillier en utilisation pour attendre les chargements d'images
<br>
<br>
Exemple :<br>
<pre>
fosfo.loadimage("niam.png");
fosfo.loadimage(["niam.png", "niam2.png"]).done(() => {
    // chargement terminé
});
</pre>
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
<pre>fosfo.drawframe("niam.png", 6, 4);</pre><br>

