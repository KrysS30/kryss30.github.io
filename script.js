let sante = 100;

function version(douce, bizarre, inquiet) {
  if (sante > 60) return douce;
  if (sante >= 30) return bizarre;
  return inquiet;
}

let timer;
function parler(texte) {
  const zone = document.getElementById("narrateur");
  clearInterval(timer);
  zone.textContent = "Narrateur : ";
  if (texte.length === 0) return;
  let i = 0;
  timer = setInterval(() => {
    zone.textContent += texte[i];
    i++;
    if (i >= texte.length) clearInterval(timer);
  }, 40);
}

function majJauge() {
  document.getElementById("jauge").textContent = "Santé mentale : " + sante;
}

function afficher(description, choix) {
  document.getElementById("scene").textContent = description;
  const zone = document.getElementById("choix");
  zone.innerHTML = "";
  for (const c of choix) {
    const b = document.createElement("button");
    b.textContent = c.texte;
    b.onclick = c.action;
    zone.appendChild(b);
  }
  majJauge();
}

function reaction(variation, douce, bizarre, inquiet, suite) {
  sante += variation;
  parler(version(douce, bizarre, inquiet));
  afficher("", [{ texte: "Continuer", action: suite }]);
}

function intro() {
  parler("Bonjour toi ! On va jouer à cache-cache. Noé s'est caché, et toi, tu vas le trouver.");
  afficher("", [{ texte: "Commencer", action: scene1 }]);
}

function scene1() {
  afficher("Un camion de jouet cassé, un lit vide, un téléphone par terre.", [
    { texte: "Ramasser le jouet", action: () => reaction(-10,
        "Oh, il est un peu abîmé !",
        "Il était déjà abîmé...",
        "Il était déjà cassé quand tu es parti.", scene2) },
    { texte: "Regarder sous le lit", action: () => reaction(-15,
        "Personne, tant pis !",
        "Personne... Pourquoi tu cherches là ?",
        "Pourquoi tu cherches là ? Tu sais bien qu'il n'est pas là.", scene2) },
    { texte: "Appeler « Noé ! »", action: () => reaction(-20,
        "Il fait semblant de ne pas t'entendre !",
        "Il n'a pas l'air de répondre...",
        "Il ne répond plus. C'est normal.", scene2) }
  ]);
}

function scene2() {
  afficher("Le jardin. Un cabanon fermé à clé, un répondeur qui clignote.", [
    { texte: "Écouter le répondeur", action: () => reaction(-20,
        "Un message de maman !",
        "Un message de maman... tu n'as pas décroché ?",
        "Tu n'as pas décroché. Tu étais occupé.", combat) },
    { texte: "Forcer le cabanon", action: () => reaction(-25,
        "Allez, on essaie !",
        "Il est fermé... mais on essaie quand même.",
        "Ferme-le. Je t'en prie. Ferme-le.", combat) },
    { texte: "Retourner dans la maison", action: () => reaction(10,
        "Bonne idée, on est mieux au chaud.",
        "On est mieux ici, non ?",
        "Reste avec moi. Tout va bien.", combat) }
  ]);
}

function combat() {
  parler(version(
    "Oh, regarde, Noé est là ! Dis-lui bonjour !",
    "Noé est là... Il te regarde depuis un moment, tu ne trouves pas ?",
    "Il est là. Ne l'écoute pas. Reste avec moi."));
  afficher("Noé apparaît, silencieux. Il te demande : « Tu étais où ? »", [
    { texte: "« J'étais sur mon téléphone. Je devais te surveiller. »", action: finVerite },
    { texte: "« Je te cherchais partout ! »", action: finDeni },
    { texte: "« Je dois retourner jouer. »", action: finDeni }
  ]);
}

function finVerite() {
  document.body.style.background = "#223344";
  parler("...");
  afficher("Le Narrateur ne dit plus rien. Noé hoche la tête, et la maison s'éclaire doucement. Tu as dit la vérité. FIN : Vérité", [
    { texte: "Rejouer", action: recommencer }
  ]);
}

function finDeni() {
  sante = 100;
  parler("Bonjour toi ! On va jouer à cache-cache. Noé s'est caché, et toi, tu vas le trouver.");
  afficher("Tout recommence, comme si rien ne s'était passé. FIN : Déni", [
    { texte: "Jouer encore", action: scene1 }
  ]);
}

function recommencer() {
  sante = 100;
  document.body.style.background = "";
  intro();
}

intro();