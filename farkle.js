let diceArr = [];
let arrays = [];
let scoreArr = [];
let meldArr = [];
let checkMeld = [];
let numberOfDice = 6;
let scoreTotal = 0;
let diceRolled = false;

const setupInitializeFunc = () => {
	initializeDice();

	for (let i = 1; i <= numberOfDice; i++) {
		document.getElementById(`die${i}`).addEventListener('click', willItMeld);
	}

	document.getElementById('btn-rolldice').addEventListener('click', rollDice);
	document.getElementById('btn-trackscore').addEventListener('click', trackScore);
};

/**
 * Initializes the dice on render and when banking a meld.
 */
const initializeDice = () => {
	for(let i = 0; i < numberOfDice; i++) {
		diceArr[i] = {};
		diceArr[i].id = "die" + (i + 1);
		diceArr[i].value = (i + 1);
		diceArr[i].clicked = 0;
	}
	updateDiceImg();
};

/**
 * Adds class to each non selected dice to add a 'roll' animation which is removed after 1s.
 */
const animateDiceRoll = () => {
		for(let i = 0; i < numberOfDice; i++) {
			let diceID = `die${i + 1}`;
			if (diceArr[i].clicked === 0) {
			document.getElementById(diceID).classList.add('roll');
			setTimeout(() => {
				document.getElementById(diceID).classList.remove('roll');
			}, 1000)
		}
	}
};

let diceToRoll = '';
/**
 * Rolls dice values and sets diceRolled to true to allow user to select dice.
 * @returns {array} checkMeld;
 */
const rollDice = () => {
	for (let i = 0; i < numberOfDice; i++) {
		if (diceArr[i].clicked === 0) {
			diceArr[i].value = Math.floor((Math.random() * numberOfDice) + 1);
			diceRolled = true;
			diceToRoll = `#die${i + 1}`;
			console.log(diceToRoll)
			animateDiceRoll();	
		} 
	}

	let repeatMeld = false;
	let textbox = document.getElementById('meld-text');
	let counted = diceArr.filter(dice => (dice.clicked === 0)).length;

	const allEqual = (arr) => checkMeld.every(val => val === arr[0])

	//map through after each dice roll creating a new array to store unclicked dice.
	diceArr.map(click => {	
		repeatMeld = allEqual(checkMeld);

		if (click.clicked === 0) {
			checkMeld.push(click.value);
			setChecker = new Set(checkMeld);
		}	
		return checkMeld;	
	});
	console.log(checkMeld, repeatMeld);
	
	//conditions to check if the current unclicked dice meet the parameters of a meld.
	if (!checkMeld.includes(1) && !checkMeld.includes(5) && counted <= 3) {
		console.log(`The array [${checkMeld}] didn't contain any melds.`)
		textbox.innerHTML = `There are no melds, try again!`;
		setScore(0);
		initializeDice();
		scoreArr = [];
		diceRolled = false;
	} else if (!checkMeld.includes(1) && !checkMeld.includes(5) && counted <= 6 && repeatMeld == false) {
		console.log(`The array [${checkMeld}] didn't contain any melds and there were no repeating numbers.`)
		textbox.innerHTML = `There are no melds, try again!`;
		setScore(0);
		initializeDice();
		scoreArr = [];
		diceRolled = false;
	} else {
		console.log('We found a meld.')
	}
	checkMeld = [];
	meldArr = [];
	updateDiceImg();
};

/**
 * Updating images of dice given values of rollDice.
 */
const updateDiceImg = () => {
	for (let i = 0; i < numberOfDice; i++) {
		let diceImage = `images/${diceArr[i].value}.png`;
		let selectedImg = document.getElementById(diceArr[i].id);
		selectedImg.setAttribute("src", diceImage);
		selectedImg.classList.toggle("transparent", diceArr[i].clicked === 1);
	}
};

/**
 * Checks to see if clicked dice can be used.
 */
const willItMeld = (event) => {
	let textbox = document.getElementById('meld-text');
	let dataNumberClicked = event.currentTarget.getAttribute("data-number");
	let clickedDice = diceArr[dataNumberClicked].value;
	let count = diceArr.filter(dice => (dice.value === clickedDice)).length;

	if (diceRolled) {
		if (clickedDice === 1 || clickedDice === 5 || count >= 3) {
			textbox.innerHTML = `${clickedDice} melds!`;
			updateScoreArray(dataNumberClicked);
		} else {
			textbox.innerHTML = `${clickedDice} is not part of a meld.`
		}
	} else {
		textbox.innerHTML = 'Roll the dice to start your turn!'
	}
	updateDiceImg();
};

/**
 * Checks if a dice has been added to the score and applies styles.
 */
const updateScoreArray = (dataNumberClicked) => {
	let diceClicked = diceArr[dataNumberClicked];

	if (diceClicked.clicked === 0) {
		diceClicked.clicked = 1;
		arrays.push({
			score: scoreArr.push(diceClicked.value),
			meld: meldArr.push(diceClicked.value)
		})
	} else {
		diceClicked.clicked = 0;
		let remove = scoreArr.indexOf(diceClicked.value);
		scoreArr.splice(remove, 1);
		meldArr.splice(remove, 1);
	}

	const newScoreTotal = calcScore();
	const bank = document.getElementById('bank');
	bank.innerHTML = newScoreTotal;
};

/**
 * Keeps track of current meld value and count of dice clicked and returns the resut.
 * @param {number} result
 */
const calcScore = () => {
	let result = 0;
	const count = {};

	for (const num of scoreArr) {
		count[num] = (count[num] ? count[num] + 1 : 1);
		let currentScore = 0;

		if (num === 1 && count[num] === 3) {
			currentScore += 1000 - 300;
		} else if (num === 1 && count[num] < 3) {
			currentScore += 100;
		} else if (num === 5 && count[num] < 3) {
			currentScore += 50;
		} else if (num === 5 && count[num] === 3) {
			currentScore += 500 - 100;
		}

		for (let i = 1; i <= numberOfDice; i++) {
			if (num !== 1 && num !== 5 && i === num && count[i] === 3) {
				currentScore += num * 100;
			} else if (i === num && count[i] === 4) {
				currentScore += (1000 - (num * 100));
			} else if (i === num && count[i] === 5) {
				currentScore += (2000 - (num * 100));
			} else if (i === num && count[i] === 6) {
				currentScore += (3000 - (num * 100));
			}
		}
		result += currentScore;
	}
	return result;
};

/**
 * calls functions to track score totals and reset dice.
 */
const trackScore = () => {
	const result = calcScore();
	meldArr = [];
	scoreArr = [];
	setScore(result);
	initializeDice();
	diceRolled = false;
	// trackPlayer();
};

let playerOne = true;
/**
 * Sets score depending on player.
 */
const setScore = (result) => {
	const meldToBank = document.getElementById('bank');
	
	meldToBank.innerHTML = `0`;
	playerOne = !playerOne;
	trackPlayer(result)
};

let player1Score = 0;
let player2Score = 0;
//TODO: Track player score and allow changing of turns
const setPlayer = () => {
	const single = document.getElementById('singleplayer');
	const multi = document.getElementById('multiplayer');
	const playersVisible = document.getElementById('player2');

	const playerOneScore = document.getElementById('player1');
	const playerTwoScore = document.getElementById('player2');
	
	if (single.checked) {
		console.log('click')
		single.classList.add('active');
		multi.classList.remove('active');
		playersVisible.classList.add('hide');

		playerOne = !playerOne;
		player1Score = 0;
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
	} else if ( multi.checked) {
		single.classList.remove('active');
		multi.classList.add('active');
		playersVisible.classList.remove('hide');

		playerOne = !playerOne;
		player1Score = 0;
		player2Score = 0;
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
		playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
	}
};

const trackPlayer = (result) => {
	let playerScore = result;

	const playerOneScore = document.getElementById('player1');
	const playerTwoScore = document.getElementById('player2');
	
	const multi = document.getElementById('multiplayer');

	if (multi.classList.contains('active')) {
		if (!playerOne) {
			player1Score += playerScore;
			playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
		} else {
			player2Score += playerScore;
			playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
		}
	} else {
		player1Score += playerScore;
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
	}
};


// create player1 & player 2 score
// pass result into track player which is called in setScore()
// copy/paste code from setScore into trackScore()
// set playerOne = false globally
// in trackPlayer set condition if (!playerOne) player1Score += playerScore; and update inner html, do opposite for player2
// add active class to the input of playerOne so that it is chosen right away
// check 'multi = document...' to see if it's active to only run the if if that condition is true

// add player1/player2 score above setPlayer and add innerHTML modifiers to set score to 0 on single/multiplayer click
// above that unser single.checked && multi.checked set playerOne = !playerOne to reset the order