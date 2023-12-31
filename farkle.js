let diceArr = [];
let arrays = [];
let scoreArr = [];
let meldArr = [];
let checkMeld = [];
let numberOfDice = 6;
let scoreTotal = 0;
let initializeTurn = false;
let diceRolled = false;
let diceToRoll = '';
let playerOne = true;
let player1Score = 0;
let player2Score = 0;
let p1TotalScore = 0;
let p2TotalScore = 0;

// tracks running total score from all of the current players sequential turns.
let initialScore = 0;
let currentScore = 0;
let totalScore = 0;

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
	initializeTurn = true;
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

/**
 * Checks dice rolled for occurences of 3 or more of the same dice values.
 * @returns {Boolean} result;
 */
const tripleChecker = (meldArr) => {
	const counter = {};
  
	meldArr.forEach(num => {
	  if (counter[num]) {
		counter[num] += 1;
	  } else {
		counter[num] = 1;
	  }
	});
	let newArr = Object.values(counter);
	let check = newArr.map(val => val >= 3);
	
	let result = check.includes(true);
	return result;
  };

/**
 * Rolls dice values and sets diceRolled to true to allow user to select dice.
 * @returns {array} checkMeld;
 */
const rollDice = () => {
	let repeatMeld = false;
	let textbox = document.getElementById('meld-text');
	let counted = diceArr.filter(dice => (dice.clicked === 0)).length;	

	if (initializeTurn) {
		initializeTurn = false;
		for (let i = 0; i < numberOfDice; i++) {
			if (diceArr[i].clicked === 0) {
				diceArr[i].value = Math.floor((Math.random() * numberOfDice) + 1);
				diceRolled = true;
				diceToRoll = `#die${i + 1}`;
			} 
		}

		const allEqual = (arr) => checkMeld.every(val => val === arr[0]);

		//map through after each dice roll creating a new array to store unclicked dice.
		diceArr.map(click => {	
			repeatMeld = allEqual(checkMeld);
			console.log(repeatMeld)
			if (click.clicked === 0) {
				checkMeld.push(click.value);
			}	
			return checkMeld;	
		});

		//conditions to check if the current unclicked dice meet the parameters of a meld.
		if (!tripleChecker(checkMeld) && !checkMeld.includes(1) && !checkMeld.includes(5) && counted <= 3) {
			console.log(`The array [${checkMeld}] didn't contain any melds.`)
			textbox.innerHTML = `There are no melds, try again!`;
			totalScore = initialScore;
			initialScore = 0;
			currentScore = 0;
			totalScore = 0;
			setScore(0);
			initializeDice();
			scoreArr = [];
			diceRolled = false;
			initializeTurn = true;
		} else if (!tripleChecker(checkMeld) && !checkMeld.includes(1) && !checkMeld.includes(5) && counted <= 6 && repeatMeld == false) {
			console.log(`The array [${checkMeld}] didn't contain any melds and there were no repeating numbers.`)
			textbox.innerHTML = `There are no melds, try again!`;
			totalScore = initialScore;
			initialScore = 0;
			currentScore = 0;
			totalScore = 0;
			setScore(0);
			initializeDice();
			scoreArr = [];
			diceRolled = false;
			initializeTurn = true;
		} else if (checkMeld.includes(1) && checkMeld.includes(2) && checkMeld.includes(3) & checkMeld.includes(4) && checkMeld.includes(5) && checkMeld.includes(6)) {
			totalScore = initialScore + 2500;
			setScore(2500);
			initializeDice();
			scoreArr = [];
			diceRolled = false;
			initializeTurn = true;
			textbox.innerHTML = `Full run!`;
		} 
		else {
			console.log('We found a meld.')
			animateDiceRoll();
			console.log(checkMeld, tripleChecker(checkMeld))
		}
		checkMeld = [];
		meldArr = [];
		updateDiceImg();

	} else if (!initializeTurn) {
		initializeTurn = false;
		textbox.innerHTML = `Select a dice to meld before rolling again!`;
	}
	totalScore += initialScore;
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
			initializeTurn = true;
		} else {
			textbox.innerHTML = `${clickedDice} is not part of a meld.`
		}
	} else {
		textbox.innerHTML = 'Roll the dice to start your turn!'
	}
	updateDiceImg();
};

/**
 * Keeps track of current meld value and count of dice clicked and returns the result.
 * @param {number} calcScoreTotal
 */
const calcScore = () => {
	let calcScoreTotal = 0;
	const count = {};

	console.log(meldArr, scoreArr)
	for (const num of meldArr) {
		count[num] = (count[num] ? count[num] + 1 : 1);
		let updateScoreTotal = 0;

		if (num === 1 && count[num] === 3) {
			updateScoreTotal += 1000 - 200;
		} else if (num === 1 && count[num] === 4) {
			updateScoreTotal += 0;
		} else if (num === 1 && count[num] === 5) {
			updateScoreTotal += 1000; 
		} else if (num === 1 && count[num] < 3) {
			updateScoreTotal += 100;
		} else if (num === 5 && count[num] < 3) {
			updateScoreTotal += 50;
		} else if (num === 5 && count[num] === 3) {
			updateScoreTotal += 500 - 100;
		}

		// use the same num of scoreArr not another for?
		for (let i = 1; i <= numberOfDice; i++) {
			if (num !== 1 && num !== 5 && i === num && count[i] === 3) {
				updateScoreTotal += num * 100;
			} else if (num !== 1 && i === num && count[i] === 4) {
				updateScoreTotal += (1000 - (num * 100));
			} else if (num !== 1 && i === num && count[i] === 5) {
				updateScoreTotal += (2000 - (num * 100));
			} else if (num !== 1 && i === num && count[i] === 6) {
				updateScoreTotal += (3000 - (num * 100));
			}
		}
		calcScoreTotal += updateScoreTotal;
	}
	currentScore = calcScoreTotal;
	return currentScore;
};

const updateScore = () => {
	let currentScore = 0;
	currentScore += calcScore();
	initialScore = currentScore;

	return initialScore;
}

/**
 * Checks if a dice has been added to the initialScore and applies styles.
 */
const updateScoreArray = (dataNumberClicked) => {
	let diceClicked = diceArr[dataNumberClicked];

	if (diceClicked.clicked === 0) {
		diceClicked.clicked = 1;
		arrays.push({
			initialScore: scoreArr.push(diceClicked.value),
			meld: meldArr.push(diceClicked.value)
		})
	} else {
		diceClicked.clicked = 0;
		let remove = meldArr.indexOf(diceClicked.value);
		scoreArr.splice(remove, 1);
		meldArr.splice(remove, 1);
	}
	
	const newScoreTotal = updateScore();
	const displayScore = totalScore + newScoreTotal;
	const bank = document.getElementById('bank');
	bank.innerHTML = displayScore;
	console.log( `		
		initialScore: ${initialScore},
		currentScore: ${currentScore},
		totalScore: ${totalScore},
		newScoreTotal: ${newScoreTotal}
		`)
};

/**
 * calls functions to track initialScore totals and reset dice.
 */
const trackScore = () => {
	let result = updateScore();

	if (playerOne) {
		p1TotalScore = result + totalScore;
		console.log(result, totalScore, p1TotalScore)
		meldArr = [];
		scoreArr = [];
		setScore(p1TotalScore);
		initializeDice();
		diceRolled = false;
		initialScore = 0;
		totalScore = 0;
	} else if (!playerOne) {
		p2TotalScore = result + totalScore;
		meldArr = [];
		scoreArr = [];
		setScore(p2TotalScore);
		initializeDice();
		diceRolled = false;
		initialScore = 0;
		totalScore = 0;
	} else if (p1TotalScore > 200) {
		playAgain();
		console.log(p1TotalScore, p2TotalScore)
	}
	console.log(p1TotalScore, p2TotalScore)
};

/**
 * Sets initialScore depending on player.
 */
const setScore = (result) => {
	const multi = document.getElementById('multiplayer');

	if (multi.classList.contains('active')) {
		playerOne = !playerOne;
	} else playerOne;

	const meldToBank = document.getElementById('bank');
	meldToBank.innerHTML = `0`;
	trackPlayer(result);
};

/**
 * Restarts the game.
 */
const playAgain = () => {

	if (p1TotalScore >= 1500) {
		alert('Player 1 wins!')
		console.log('Player 1 wins!')
	}
	if (p2TotalScore >= 1500) {
		alert('Player 2 wins!')
		console.log('Player 2 wins!')
	}
};

/**
 * Tracks the status of single or multiplayer.
 */
const setPlayer = () => {
	const single = document.getElementById('singleplayer');
	const multi = document.getElementById('multiplayer');
	const playersVisible = document.getElementById('player2');
	const playerOneScore = document.getElementById('player1');
	const playerTwoScore = document.getElementById('player2');
	const trackPlayer1 = document.querySelector("#player1");
	const trackPlayer2 = document.querySelector("#player2");
	const scoreContainer = document.querySelector(".container-score");
	
	if (single.checked) {
		console.log('Singleplayer Selected')
		single.classList.add('active');
		multi.classList.remove('active');
		playersVisible.classList.add('hide');
		scoreContainer.classList.remove('multiplayer');
		initializeDice();
		meldArr = [];
		trackPlayer1.classList.remove('active');
		trackPlayer2.classList.remove('active');
		
		playerOne = playerOne;
		player1Score = 0;
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
	} else if ( multi.checked) {
		console.log('Multiplayer Selected')
		single.classList.remove('active');
		multi.classList.add('active');
		playersVisible.classList.remove('hide');
		scoreContainer.classList.add('multiplayer');
		initializeDice();
		meldArr = [];
		trackPlayer1.classList.add('active');

		playerOne = playerOne;
		console.log(playerOne)
		player1Score = 0;
		player2Score = 0;
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
		playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
	}
};

/**
 * Tracks the current player with visual representation as well as tracks score.
 */
const trackPlayer = (result) => {
	let playerScore = result;

	const playerOneScore = document.getElementById('player1');
	const playerTwoScore = document.getElementById('player2');
	const trackPlayer1 = document.querySelector("#player1");
	const trackPlayer2 = document.querySelector("#player2");
	const multi = document.getElementById('multiplayer');

	if (multi.classList.contains('active')) {
		
		if (!playerOne) {
			trackPlayer1.classList.remove('active')
			trackPlayer2.classList.add('active')
		} else {
			trackPlayer2.classList.remove('active')
			trackPlayer1.classList.add('active')
		}

		if (!playerOne) {
			player1Score += playerScore;
			playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
			if (player1Score > 500) {
				console.log('Player 1 wins!')
				openModal('Player One');
				player1Score = 0;
				player2Score = 0;
				playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
				playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
				initializeTurn = true;
			}
		} else {
			player2Score += playerScore;
			playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
			if (player2Score > 500) {
				console.log('Player 2 wins!')
				openModal('Player Two');
				player1Score = 0;
				player2Score = 0;
				playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
				playerTwoScore.innerHTML = `P2 Total : ${player2Score}`;
				initializeTurn = true;
			}
		}
	} else {
		player1Score += playerScore;
		console.log(player1Score)
		playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
		if (player1Score > 500) {
			playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
			console.log('Player 1 wins!')
			openModal('Player One');
			player1Score = 0;
			playerOneScore.innerHTML = `P1 Total : ${player1Score}`;
			initializeTurn = true;
		}
	}
};

// create variables representing the modal and overlay to be accessed in openMmodal and closeModal functions.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

/**
 * Opens the modal after function is called when the user reaches desired score.
 */
const openModal = (winner) => {
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");

	const user = `<p class="modal-text">${winner}</p>`;
	const modalContent = document.getElementById("flex-container");
	const confetti = document.getElementById("confetti-container");
	modalContent.innerHTML = `
		<div class="modal-text__container">
			${user}
			<p class="modal-text">wins!</p>
		</div>
		<button class="btn btn-play">Play Again!</button>
	`

	confetti.innerHTML = `
		<div class="container">
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
			<div class="confetti"></div>
  		</div>
	`
	const playAgainBtn = document.querySelector(".btn-play");
	playAgainBtn.addEventListener("click", initializeDice);
	playAgainBtn.addEventListener("click", closeModal);

	let textbox = document.getElementById('meld-text');
	textbox.innerHTML = 'Roll the dice to start your turn!'
};

/**
 * Closes the modal on user click.
 */
const closeModal = () => {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");

	const confetti = document.getElementById("confetti-container");
	confetti.innerHTML = ``;
};



overlay.addEventListener("click", closeModal);


// create player1 & player 2 initialScore
// pass result into track player which is called in setScore()
// copy/paste code from setScore into trackScore()
// set playerOne = false globally
// in trackPlayer set condition if (!playerOne) player1Score += playerScore; and update inner html, do opposite for player2
// add active class to the input of playerOne so that it is chosen right away
// check 'multi = document...' to see if it's active to only run the if if that condition is true

// add player1/player2 initialScore above setPlayer and add innerHTML modifiers to set initialScore to 0 on single/multiplayer click
// above that unser single.checked && multi.checked set playerOne = !playerOne to reset the order

// fix allowing dice to be rolled without dice clicked.