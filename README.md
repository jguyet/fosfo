# fosfo
Libraire javascript pour jeu vidéo avec canvas
<br>
<h2>Documentation :</h2><br><br>

<code>
fosfo.loadimage("one_url");
fosfo.loadimage(["one_url", "seconde_url"]);
</code>
loadimage preload vos images avant de démarrer votre programme ou jeu.<br>
Un callback de retour et conceillier en utilisation pour attendre les chargements d'images<br>
Exemple :<br>
<code>
fosfo.loadimage("one_url");
fosfo.loadimage(["one_url", "seconde_url"]).done(
	function(){
		//chargement terminé
	}
);
</code>

