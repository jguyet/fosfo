# fosfo
Librairie javascript pour jeu vidéo avec canvas
<br>
<h2>Documentation :</h2><br>

<h3>function loadimage(url) :</h3>
<br>
fosfo.loadimage preload vos images avant de démarrer votre programme ou jeu.
<br>
Un callback de retour et conceillier en utilisation pour attendre les chargements d'images
<br>
<br>
Exemple :<br>
<code>fosfo.loadimage("one_url");</code><br>
<code>fosfo.loadimage(["one_url", "seconde_url"]).done(</code><br>
<code>	function(){</code><br>
<code>		//chargement terminé</code><br>
<code>	}</code><br>
<code>);</code>

