/**
 * @jest-environment jsdom
 */

const {
	game,
	newGame,
	showScore,
	addTurn,
	lightsOn,
	showTurns,
	playerTurn
} = require('../game.js');

// Jest spy
jest.spyOn(window, 'alert').mockImplementation(() => {

})

beforeAll(() => {
	const fs = require('fs');
	const fileContents = fs.readFileSync('index.html', 'utf8');
	document.open();
	document.write(fileContents);
	document.close();
});
// Game Object
describe('game object contains correct keys', () => {
	test('score key exists', () => {
		expect('score' in game).toBe(true);
	});
	test('currentGame key exists', () => {
		expect('currentGame' in game).toBe(true);
	});
	test('currentGame type to be of array/object', () => {
		expect(typeof game.currentGame).toBe('object');
	});
	test('playerMoves key exists', () => {
		expect('playerMoves' in game).toBe(true);
	});
	test('choices key exists', () => {
		expect('choices' in game).toBe(true);
	});
	test('turnNumber key exists', () => {
		expect('turnNumber' in game).toBe(true)
	})
	test('choices contain correct ids', () => {
		expect(game.choices).toEqual(['button1', 'button2', 'button3', 'button4']);
	});
	test('turnInProgress key should exist', () => {
		expect(game.turnInProgress).toBeDefined();
		expect(game.turnInProgress).toBe(false);
	})
	test('lastButton key exists', () => {
		expect('lastButton' in game).toBe(true)
	})
});

// newGame function
describe('newGame function works correctly', () => {
	// Test game stage with fake values
	beforeAll(() => {
		game.score = 42;
		game.turnNumber = 5;
		game.currentGame = ['button1', 'button2'];
		game.playerMoves = ['button1', 'button2'];
		document.getElementById('score').innerText = '42';
		game.turnInProgress = false

		// console.log('Game: ', game)
		newGame();
		// console.log('Game: ', game)
	});



	test('should set game score to 0', () => {
		expect(game.score).toBe(0);
	});
	test('computer\'s game array should contain one element', () => {
		expect(game.currentGame.length).toBe(1);
	});
	test('should clear the playerMoves array', () => {
		expect(game.playerMoves.length).toBe(0);
	});
	test('should display 0 for element with id of score', () => {
		expect(document.getElementById('score').innerText).toEqual(0);
	});
	test('should reset turnNumber to 0', () => {
		expect(game.turnNumber).toBe(0)
	})

});

describe('Game play works correctly', () => {
	beforeEach(() => {
		game.score = 0;
		game.currentGame = [];
		game.playerMoves = [];
		console.log('Game: ', game);
		addTurn();
	});
	console.log('Game: ', game);


	afterEach(() => {
		game.score = 0;
		game.currentGame = 0;
		game.playerMoves = 0;
	});
	test('addTurn adds a new turn to the game', () => {
		addTurn();
		expect(game.currentGame.length).toBe(2);
	});
	test('should add correct class to light up the buttons', () => {
		let button = document.getElementById(game.currentGame[0]);
		lightsOn(game.currentGame[0]);
		expect(button.classList).toContain('light');
	});
	test('showTurns should update game.turnNumber', () => {
		game.turnNumber = 42;
		showTurns();
		expect(game.turnNumber).toBe(0);
	});

	// If you want to test that an event listener has been attached to the DOM,
	// then something like a global state or an attribute (below) has to be used.
	test('expect each of the four data-listener attributes to be', () => {
		let circles = document.getElementsByClassName('circle')
		Array.from(circles).forEach(element => {
			expect( /** @type {HTMLElement}*/ (element).dataset.listener).toBe("true");
		})
		for (let circle of circles) {
			expect(circle.getAttribute("data-listener")).toEqual("true")
		}
	})

	test('should increment score if turn is correct', () => {
		game.playerMoves.push(game.currentGame[0]);
		let initialScore = game.score
		playerTurn();
		console.log('Game: ', game)
		expect(game.score).toBe(initialScore + 1)
	})

	test('should call an alert if the move is wrong', () => {
		game.playerMoves.push('wrong');
		playerTurn()
		expect(window.alert).toHaveBeenCalledWith("Wrong move!")
	});
	test('turnInProgress should be true whilst showTurn is being called', () => {
		addTurn();
		showTurns();
		expect(game.turnInProgress).toBe(true)
	})
	test('clicking during computer sequence should fail', () => {
		showTurns();
		game.lastButton = "";
		document.getElementById('button2').click();
		expect(game.lastButton).toEqual("");
	})
});