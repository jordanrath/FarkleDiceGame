let diceArr = [];
let arrays = [];
let scoreArr = [];
let meldArr = [];
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
 * Rolls dice values and sets diceRolled to true to allow user to select dice.
 */
let checkMeld = [];
const rollDice = () => {
	for(let i = 0; i < numberOfDice; i++) {
		if (diceArr[i].clicked === 0) {
			diceArr[i].value = Math.floor((Math.random() * numberOfDice) + 1);
			diceRolled = true;
		}
	}
	// check the unselected dice to see if they belong in a meld, if they do not, initialize the dice and reset the score.
	// const meldResetHelper = (event) => {
	let counted = diceArr.filter(dice => (dice.clicked === 0)).length;
	// let dataNumberClicked = event.currentTarget.getAttribute("data-number");
	// let clickedDice = diceArr[dataNumberClicked].value;
	// let count = diceArr.filter(dice => (dice.value === clickedDice)).length;
	// let checkMeldCount = checkMeld.filter(dice => (dice.value === clickedDice)).length
	const allEqual = (arr) => checkMeld.every(val => val === arr[0])
	//////////////////////////////////////////////////////////////////////////////////////////////
	
	diceArr.map(click => {
		let textbox = document.getElementById('meld-text');
		if (click.clicked === 0) {
			checkMeld.push(click.value);
			console.log(allEqual(checkMeld))
			// console.log('checkmeld', checkMeld, 'count unclicked', counted)
			if (checkMeld !== 1 && checkMeld !== 5 && counted < 3) {
				textbox.innerHTML = `There are no melds, try again!`;
				setScore(0);
				initializeDice();
				scoreArr = [];
			}
		}
		console.log(allEqual(checkMeld), checkMeld)
	});
	checkMeld = [];

	//empty scoreArr to reset the meld check after user has selected meldable dice
	// scoreArr = [];
	meldArr = [];
	updateDiceImg();
	console.log('update')
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

	// const clicksCounter = (event) => {
	// 	let dataNumberClicked = event.currentTarget.getAttribute("data-number");
	// 	let clickedDice = diceArr[dataNumberClicked].value;
	// 	let count = diceArr.filter(dice => (dice.value === clickedDice)).length
	// }
	

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
		// scoreArr.push(diceClicked.value);
		// meldArr.push(diceClicked.value);
		console.log('melds array', meldArr)
		console.log('score array', scoreArr)
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

//TODO: Fix issues with all counts not adding correctly and add three pairs and full run.
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
			currentScore += 500;
		}

		for (let i = 1; i <= numberOfDice; i++) {
			if (i === num && count[i] === 3) {
				currentScore += num * 100;
			} else if (i === num && count[i] === 4) {
				currentScore += (1000 - (i * 100));
			} else if (i === num && count[i] === 5) {
				currentScore += 1000;
			} else if (i === num && count[i] === 6) {
				currentScore += 1000;
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