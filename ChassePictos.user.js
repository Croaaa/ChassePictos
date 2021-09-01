// ==UserScript==
// @name       Hordes - Chasse aux pictos
// @version    1.5
// @match      http://hordes.fr/*
// @match      http://www.hordes.fr/*
// @match      http://die2nite.com/*
// @match      http://www.die2nite.com/*

// @grant      unsafeWindow
// @updateURL  https://github.com/Croaaa/ChassePictos/raw/main/ChassePictos.user.js
// @downloaURL https://github.com/Croaaa/ChassePictos/raw/main/ChassePictos.user.js
// ==/UserScript==

var console = unsafeWindow.console;
var localStorage = unsafeWindow.localStorage;

console.log('HordesChassePictos started');

/* GENERAL FUNCTIONS */
function sel(name, parent) {
	var context = parent || document;
	var simple = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.test(name); //From jQuery
	if (name[0] == "." && simple)
		{ return context.getElementsByClassName(name.slice(1))[0]; }
	else if (name[0] == '#' && simple)
		{ return document.getElementById(name.slice(1)); }
	else
		{ return context.querySelector(name); }
}

function selAll(name, parent) {
	var context = parent || document;
	var simple = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.test(name);
	if (simple)
		{ return [].slice.call(context.getElementsByClassName(name.slice(1))); }
	else
		{ return [].slice.call(context.querySelectorAll(name)); }
}

function addNewEl(type, parent, id, content, attrs) {
	if (['svg', 'path', 'rect', 'text'].indexOf(type) != -1)
		{ var el = document.createElementNS('http://www.w3.org/2000/svg', type); }
	else
		{ var el = document.createElement(type); }
	if (id) { el.id = id; }
	if (content) { el.innerHTML = content; }
	if (attrs) { for (i in attrs) { el.setAttribute(i, attrs[i]); } }
	if (parent) { parent.appendChild(el); }
	return el;
}

/* SCRIPT */
var allPictos =
    [['r_heroac', "Actions héroïques", true],
     ['r_sandb' , "Boules de sable !", true],
     ['r_cmplst', "Campeur de l'au-delà", true],
     ['r_watgun', "Canons à eau", true],
     ['r_chstxl', "Chanceux", true],
     ['r_ebuild', "Construction de Merveilles", true],
     ['r_surgrp', "Dernière ligne", true],
     ['r_explo2', "Explorations très lointaines", true],
     ['r_goodg' , "Good Guy", true],
     ['r_santac', "Le Père Noël est une ordure", true],
     ['r_maso'  , "Masochisme", true],
     ['r_bgum'  , "Médailles communautaires", true],
     ['r_ebcstl', "Merveille : Château de sable", true],
     ['r_ebpmv' , "Merveille : PMV géant", true],
     ['r_ebgros', "Merveille : Roue de Grostas", true],
     ['r_ebcrow', "Merveille : Statue du Corbeau", true],
     ['r_surlst', "Mort Ultime !", true],
     ['r_suhard', "Mort Ultime du Pandémonium !", true],
     ['r_dinfec', "Morts par Infection", true],
     ['r_dnucl' , "Morts par l'atome", true],
     ['r_door'  , "Ouverture de porte", true],
     ['r_wondrs', "Projets insensés", true],
     ['r_rp'    , "Rôliste", true],
     ['r_batgun', "Super lance-piles", true],
     ['r_pande' , "Survivant de l'enfer !", true],
     ['r_ginfec', "Témoin de la Grande Contamination", true],
     ['r_tronco', "Tronçonneuses", true],
     ['r_ptame' , "Valeur de l'âme", true],
     ['r_winthi', "Ville participante", true],
     ['r_alcool', "Alcools", false],
     ['r_homeup', "Améliorations de maison", false],
     ['r_cwater', "Arroseur", false],
     ['r_refine', "Artisanat", false],
     ['r_solban', "Banni émancipé", false],
     ['r_ban'   , "Bannissements", false],
     ['r_wound' , "Blessures", false],
     ['r_cookr' , "Bons p'tits plats", false],
     ['r_animal', "Boucherie", false],
     ['r_camp'  , "Campeur téméraire", false],
     ['r_cannib', "Cannibalisme", false],
     ['r_buildr', "Chantiers", false],
     ['r_nodrug', "Clean", false],
     ['r_collec', "Collecteur d'âmes", false],
     ['r_wrestl', "Combats désespérés", false],
     ['r_cooked', "Cuisine exotique", false],
     ['r_digger', "Déblaiement", false],
     ['r_deco'  , "Décoration", false],
     ['r_drug'  , "Drogues", false],
     ['r_cobaye', "Expérimentations", false],
     ['r_ruine' , "Exploration de ruine", false],
     ['r_explor', "Explorations avancées", false],
     ['r_share' , "Générosité", false],
     ['r_guide' , "Guide Spirituel", false],
     ['r_drgmkr', "Laborantin", false],
     ['r_theft' , "Larcins", false],
     ['r_broken', "Maladresses", false],
     ['r_forum' , "Messages", false],
     ['r_jtamer', "Métier Apprivoiseur", false],
     ['r_jrangr', "Métier Éclaireur", false],
     ['r_jermit', "Métier Ermite", false],
     ['r_jcolle', "Métier Fouineur", false],
     ['r_jguard', "Métier Gardien", false],
     ['r_jtech' , "Métier Technicien", false],
     ['r_dcity' , "Morts dans votre lit", false],
     ['r_dwater', "Morts par Déshydratation", false],
     ['r_ddrug' , "Morts par Manque", false],
     ['r_dhang' , "Pendaisons", false],
     ['r_mystic', "Mysticisme", false],
     ['r_doutsd', "Nuits dans le désert", false],
     ['r_plundr', "Pillages de maison", false],
     ['r_repair', "Réparations", false],
     ['r_brep'  , "Réparations de chantiers", false],
     ['r_cgarb' , "Sorteur", false],
     ['r_hbuild', "Travaux chez soi", false],
     ['r_guard' , "Veilleur", false],
     ['r_winbas', "Ville classée", false],
     ['r_wintop', "Ville légendaire !", false],
     ['r_killz' , "Zombies éliminés", false]];

var popup = addNewEl('div', document.body, 'HCP-popup');
popup.style.position = 'fixed';
popup.style.width = '500px';
popup.style.padding = '20px 5px 5px 5px';
popup.style.zIndex = '3000';
popup.style.left = Math.floor((window.innerWidth - 500) / 2) + 'px';
popup.style.top = '100px';
popup.style.backgroundColor = '#7e4d2a';
popup.style.border = '2px #4e1d0a solid';
popup.style.borderRadius = '5px';
popup.style.display = 'none';
addNewEl('div', popup, null, "X", {
	style: 'position: absolute; cursor: pointer; right: 5px; top: 5px; padding: 5px; border: 1px solid black; border-radius: 3px; background-color: #3D2016;',
}).addEventListener('click', function() { popup.style.display = 'none' });
var popupContent = addNewEl('div', popup);
popupContent.style.maxHeight = '500px';
popupContent.style.overflowY = 'auto';

function analyseProfile() {
	var playerName = sel('.tid_userName span').textContent;
	var results = [];

	var pictos = localStorage['HordesChassePictos-pictos'];
	if (pictos == undefined || pictos.length < 2) {
		alert("Choisis des pictos avant de faire l'analyse !");
		return;
	}
	pictos = pictos.split(';');

	for (var i = 0; i < pictos.length; i++) {
		var img = sel('.tid_goalListWrapper .tid_goal img[src$="' + pictos[i] + '.gif"]');
		if (img) {
			results.push(img.parentNode.getElementsByTagName('span')[0].textContent);
		}
		else {
			results.push('0');
		}
	}
	results = results.join(',');

	var inList = false;
	var players = localStorage['HordesChassePictos-players'];
	if (players == undefined) {
		players = '';
	}
	players = players.split(';');
	for (var i = 0; i < players.length; i++) {
		if (!players[i]) { //Empty string
			players.splice(i, 1);
			continue;
		}
		var player = players[i].split(':');
		if (player[0] == playerName) { //Update
			players[i] = [playerName, results].join(':');
			inList = true;
		}
	}
	if (!inList) {
		players.push([playerName, results].join(':'));
	}
	localStorage['HordesChassePictos-players'] = players.join(';');
	alert('Ok !');
}

function showResults() {
	var pictos = localStorage['HordesChassePictos-pictos'];
	if (pictos == undefined || pictos.length < 2) {
		alert("Choisis des pictos avant de faire l'analyse !");
		return;
	}
	pictos = pictos.split(';');

	popup.style.display = 'block';
	popupContent.innerHTML = '';
	addNewEl('h1', popupContent, null, "Résultats de la Chasse aux pictos", { style: 'font-size: 1.3em; text-align: center;' });

	var table = addNewEl('table', popupContent);
	table.style.borderCollapse = 'collapse';
	var thead = addNewEl('tr', table);
	addNewEl('th', thead, null, "Pseudo").style.border = '1px solid black';
	for (var i = 0; i < pictos.length; i++) {
		var pictoName = "???";
		for (var j = 0; j < allPictos.length; j++) {
			if (pictos[i] == allPictos[j][0]) {
				pictoName = allPictos[j][1];
			}
		}
		addNewEl('th', thead, null, pictoName).style.border = '1px solid black';
	}
	
	var players = localStorage['HordesChassePictos-players'];
	if (players == undefined || players == '') {
		players = '';
		addNewEl('tr', table, null, '<td colspan="' + (pictos.length + 1) + '">' + "Fais des analyses avant de regarder les résultats, ducon !" + '</td>').style.textAlign = 'center';
		return;
	}
	players = players.split(';');
	for (var i = 0; i < players.length; i++) {
		if (!players[i]) {
			continue;
		}
		var player = players[i].split(':');
		var playerPictos = player[1].split(',');
		tr = addNewEl('tr', table);
		addNewEl('td', tr, null, player[0]).style.border = '1px solid black';
		for (var j = 0; j < playerPictos.length; j++) {
			addNewEl('td', tr, null, playerPictos[j]).style.border = '1px solid black';
		}
	}
}

function selectPictos() {
	popup.style.display = 'block';
	popupContent.innerHTML = '';

	var currentPictos = localStorage['HordesChassePictos-pictos'];
	if (currentPictos == undefined || currentPictos == '') {
		currentPictos = [];
	}
	else {
		currentPictos = currentPictos.split(';');
	}

	addNewEl('h1', popupContent, null, "Choix des pictos", { style: 'font-size: 1.3em; text-align: center; margin-bottom: 10px;' });
	addNewEl('a', popupContent, null, "Réinitialiser les pictos", { class: 'button', style: 'margin-bottom: 10px;' }).addEventListener('click', function() {
		if (localStorage['HordesChassePictos-players'] && confirm("Réinitialiser les données joueurs ?")) {
			localStorage['HordesChassePictos-players'] = '';
			localStorage['HordesChassePictos-pictos'] = '';
			selectPictos();
		}
	});

	for (var i = 0; i < allPictos.length; i++) {
		var picto = allPictos[i];
		var pictoBlock = addNewEl('div', popupContent);
		var attrs = { type: 'checkbox', 'data-picto': picto[0] };
		if (currentPictos.indexOf(picto[0]) != -1) {
			attrs = { checked: true, type: 'checkbox', 'data-picto': picto[0] };
		}
		addNewEl('input', pictoBlock, null, null, attrs).addEventListener('click', function() {
			if (this.checked) {
				if (localStorage['HordesChassePictos-players']) {
					if (confirm("Réinitialiser les données joueurs ?")) {
						localStorage['HordesChassePictos-players'] = '';
					}
					else {
						this.checked = false;
						return;
					}
				}
				currentPictos.push(this.getAttribute('data-picto'));
				localStorage['HordesChassePictos-pictos'] = currentPictos.join(';');
			}
			else {
				if (localStorage['HordesChassePictos-players']) {
					if (confirm("Réinitialiser les données joueurs ?")) {
						localStorage['HordesChassePictos-players'] = '';
					}
					else {
						this.checked = true;
						return;
					}
				}
				currentPictos.splice(currentPictos.indexOf(this.getAttribute('data-picto')), 1);
				localStorage['HordesChassePictos-pictos'] = currentPictos.join(';');
			}
		});
		addNewEl('img', pictoBlock, null, null, { src: 'http://www.hordes.fr/img/icons/' + picto[0] + '.gif' }).style.margin = '0 5px';
		addNewEl('span', pictoBlock, null, picto[1]);
		pictoBlock.style.borderRadius = '2px';
		pictoBlock.style.marginBottom = '3px';
		if (picto[2]) { //Rare
			pictoBlock.style.border = '1px solid #FEB500';
			pictoBlock.style.backgroundColor = '#711600';
		}
		else { //Normal
			pictoBlock.style.border = '1px solid #DDAB76';
			pictoBlock.style.backgroundColor = '#3D2016';
		}
	}
}

function reset() {
	if (confirm("Sûr ?")) {
		localStorage['HordesChassePictos-players'] = '';
	}
}

function addButton(text, func, parent, before) {
	var but = addNewEl('a', null, null, text, { class: 'button' });
	but.addEventListener('click', func);
	parent.insertBefore(but, before);
}

setInterval(function() {
	var ghostpage = sel('#ghost_pages');
	if (ghostpage && sel('.tid_userGoals', ghostpage)) {
		var right = sel('.right:not(.HCP-scripted)', ghostpage)
		right.className += ' HCP-scripted';
		var scoreBlock = sel('.score', right);
		right.insertBefore(addNewEl('h2', null, null, "Chasse aux pictos"), scoreBlock);
		addButton("Chasse : Choix des pictos", selectPictos, right, scoreBlock);
		addButton("Chasse : Analyse profil", analyseProfile, right, scoreBlock);
		addButton("Chasse : Résultats", showResults, right, scoreBlock);
		addButton("Chasse : Réinitialiser", reset, right, scoreBlock);
	}
}, 250);
