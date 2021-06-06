// do proměnné si uložíme prvek, do kterého budeme vypisovat seznam [úkol]
const seznam = document.querySelector('#seznam');

// založíme si prázdné pole, ve kterém budeme uchovávat úkoly
let ukoly = [];

// v poli budou úkoly jako objekty, každý úkol má popis a důležitost
// když něco v poli bude, mělo by to vypadat takto:
/*
ukoly = [
	{
		popis: 'Koupit chleba',
		dulezitost: 'vysoká'
	},
	{
		popis: 'Vyvenčit psa',
		dulezitost: 'střední'
	},
	... atd.
];
*/

// ihned po načtení stránky zavoláme funkci,
// která přečte seznam úkolů z Local Storage
nactiUkoly();

// a hned seznam úkolů zobrazíme
zobrazUkoly();



// funkce pro načtení seznamu úkolů z Local Storage
function nactiUkoly() {
	// načteme z local storage
	let hodnota = localStorage.getItem('ukoly');

	// hodnotu musíme převést z textové podoby zpět na data
	// teprve takto převedenou hodnotu uložíme do našeho pole úkolů
	if (hodnota === null || hodnota === undefined) {
		// hodnota nexistuje, vyprázdníme i naše pole
		ukoly = [];
	} else {
		// hodnota existuje, do úkolu dáme hodnotu převedenou z textu na data
		ukoly = JSON.parse(hodnota);
	}
}


// funkce pro uložení seznamu úkolů do Local Storage
function ulozUkoly() {
	// pole úkolů musíme převést na text, abychom ho mohli uložit do Local Storage
	let hodnota = JSON.stringify(ukoly);

	// a uložíme do local storage pod jménem "ukoly"
	localStorage.setItem('ukoly', hodnota);
}


// funkce pro zobrazení seznamu úkolů na stránce
function zobrazUkoly() {
	// nejprve seznam na stránce vyprázdníme
	seznam.innerHTML = '';

	// pokud není pole úkolů prázdné
	if (ukoly.length > 0) {

		// projdeme pole úkolů a postupně do stránky připojíme jednotlivé úkoly
		for (let i = 0; i < ukoly.length; i++) {

			// zavoláme funkci, která nám pro daný úkol vygeneruje HTML prvky
			// jako parametry jí předáme index v poli, text úkolu a důležitost
			let ukol = vytvorPrvekUkolu(i, ukoly[i].popis, ukoly[i].dulezitost, ukoly[i].datum);

			// vytvořený prvek, který se vrátí z funkce, připojíme do stránky do seznamu úkolů
			seznam.appendChild(ukol);
		}

	}
}


// funkce, která vytvoří HTML prvky jednoho úkolu
// jako parametry očekává index úkolu v poli, popis a důležitost úkolu
function vytvorPrvekUkolu(index, popis, dulezitost, datum) {
	/*
	Chceme, aby daný prvek v HTML vypadal následovně:
	<li>
		Popis úkolu - (vysoká důležitost)
		<button data-index="1" onclick="odstranUkol()">x<button>
	</li>
	Tlačítko "X" bude sloužit ke smazání úkolu ze seznamu.
	*/

	// element <li>
	let liElement = document.createElement('li');

	// elementu nastavíme text s popisem a důležitostí úkolu
	liElement.textContent = popis + ' - (' + dulezitost + ' důležitost, udělat do ' + datum + ')';

	// vytvoříme tlačítko pro smazání úkolu
	let buttonElement = document.createElement('button');
	buttonElement.textContent = 'x';
	// tlačítku nastavíme data-index, do kterého uložíme index úkolu v poli pro účely mazání
	buttonElement.dataset.index = index;
	// a přidáme událost při kliknutí, která bude volat funkci pro smazání úkolu
	buttonElement.onclick = odstranUkol;

	// tlačítko připojíme do <li> za text úkolu
	liElement.appendChild(buttonElement);

	// vytvořený element vrátíme z funkce ven
	return liElement;
}


// funkce pro smazání úúkolu při kliknutí na tlačítko "x" vedle popisu úkolu
function odstranUkol() {
	// tla4čítko, které vyvolalo událost kliknutí, je přístupné pomocí slove this
	// z tlačítka si přečteme data-index atribut, ve kterémm máme uložený index
	// úkolu v poli, který chceme smazat
	let index = this.dataset.index;

	// z pole úkolů odstraníme jeden prvek na tomto indexu
	ukoly.splice(index, 1);

	// změněné pole úkolů uložíme do local storage
	ulozUkoly();

	// a vygenerujeme na stránce nový seznam úkolů, aby se v nich projevila změna
	zobrazUkoly();
}


// funkce pro přidání úkolu do seznamu
function pridejUkol() {
	// získáme hodnoty z polí formuláře
	let popis = document.querySelector('#popis').value;
	let dulezitost = document.querySelector('#dulezitost').value;
	let datum = document.querySelector('#datum').value;

	// pokud není zadaný text úkolu, tak oznámíme chybu a opustíme funkci
	if (popis === '') {
		alert('Prosím, zadej popis úkolu.');
		// když použijeme jen slovo return bez čehokoliv dalšího,
		// přeruší se vykonávání funkce a nic dalšího už se ve funkci neprovede
		// můžeme to tedy použít pro opuštění funkce uprostřed jejího kódu
		return;
	}
	if (datum === '') {
		alert('Prosím, zadej datum ukončení úkolu.');
		return;
	}

	// z hodnot vytvoříme objekt
	let ukol = {};
	ukol.popis = popis;
	ukol.dulezitost = dulezitost;
	ukol.datum = datum;

	// a tento objekt přidáme na konec pole
	// kdybychom ho chtěli přidat na začátek, použili bychom místo push() metodu unshift()
	ukoly.push(ukol);

	// změněné pole úkolů uložíme do local storage
	ulozUkoly();

	// a vygenerujeme nový seznam úkolů na stránce, aby se v nich objevil i náš nový přidaný
	zobrazUkoly();

	// vyresetujeme formulář, aby v něm nezůstal text právě přidaného úkolu
	document.querySelector('#formular').reset();
}