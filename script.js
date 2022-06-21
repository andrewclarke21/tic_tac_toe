const gameCells = document.querySelectorAll(".game-cell");
const winner = document.querySelector(".winner");
const rematch = document.querySelector(".rematch");
const nameButton = document.querySelector(".name-button");
const playerXElement = document.querySelector(".player-x");
const playerOElement = document.querySelector(".player-o");
const nameOne = document.querySelector("#name1");
const nameTwo = document.querySelector("#name2");
const formContainer = document.querySelector(".player-input-container");
const nameOneError = document.querySelector("#name1::after");
const nameTwoError = document.querySelector("#name2::after");
const firstPlayer = document.querySelector(".first-player");

// This program is too nested and complex in terms of passing data. It needs to be more modular and easier to read and understand.
// Each function should be more simple and do less
// Elements

// Global Variables
let submit = false;
let roundFlag = false;

// Functions

// Objects

function gameRound(gameCellList, rng) {
  let currentPlayer;

  let roundTrack = {
    round: 0,
  };

  function binaryPlayerChoice(input, object = "") {
    if (input === false) {
      input = 0;
    }

    if (input === true) {
      input = 1;
    }

    console.log("test");
    switch (input) {
      case 0:
        currentPlayer = "playerX";
        console.log(input, currentPlayer);
        break;
      case 1:
        currentPlayer = "playerO";
        console.log(input, currentPlayer);
        break;
    }

    markGameCell(currentPlayer, object);
    console.log(gameCellList);

    return currentPlayer;
  }

   currentPlayer = binaryPlayerChoice(rng);

  gameCellList.addCellListener(roundTrack, binaryPlayerChoice, rng);
  return { roundTrack, currentPlayer };
}

function markGameCell(player, object = "") {
  if (
    player === "playerX" &&
    object.playerX === false &&
    object.playerO === false
  ) {
    object.playerX = true;
    object.playerO = false;
  } else if (
    player === "playerO" &&
    object.playerX === false &&
    object.playerO === false
  ) {
    object.playerX = false;
    object.playerO = true;
  }
}

const GameBoard = (function () {
  let playerControlledO = false;
  let playerControlledX = false;

  const gameCellList = [];
  console.log(gameCells);
  for (let i = 0; i < gameCells.length; i++) {
    let number = i + 1;
    let gameCell = {
      element: gameCells[i],
      playerO: playerControlledO,
      playerX: playerControlledX,
      clicked: false,
      gameCellNumber: number,
    };

    console.log(gameCell.gameCellNumber);
    gameCellList.push(gameCell);
    console.log(gameCellList);
  }

  return { gameCellList };
})();

// module IIFE
const rng = (function () {
  const rng = Math.floor(Math.random() * 2);
  return rng;
})();

const gameBoardEvent = (function () {
  let playerXScore;
  let playerOScore;
  let reset = false;

  let playerXScoreNumber = 0;
  let playerOScoreNumber = 0;
  const { gameCellList } = GameBoard;
  console.log(gameCellList);

  (function () {
    nameButton.addEventListener("click", function (e) {
      e.preventDefault();
      playerXElement.innerText = nameOne.value;
      playerOElement.innerText = nameTwo.value;
      playerXScore = playerXElement.innerText;
      playerOScore = playerOElement.innerText;

      if (playerXScore === "" || playerXScore === undefined) {
        playerXScore = "playerX";
      }
      if (playerOScore === "" || playerOScore === undefined) {
        playerOScore = "playerO";
      }

      while (playerXScore.length > 20) {
        playerXScore = playerXScore.slice(0, -1);
      }
      while (playerOScore.length > 20) {
        playerOScore = playerOScore.slice(0, -1);
      }

      let gameRoundObject = gameRound(gameBoardEvent, rng);
      submit = true;
      formContainer.classList.add("hidden");
      playerXElement.innerText =
        playerXScore.charAt(0).toUpperCase() + playerXScore.slice(1) + ":";
      playerOElement.innerText =
        playerOScore.charAt(0).toUpperCase() + playerOScore.slice(1) + ":";
      console.log("round", gameRoundObject.roundTrack.round);
      firstPlayer.innerText = `${gameRoundObject.currentPlayer.charAt(0).toUpperCase() + gameRoundObject.currentPlayer.slice(1)} goes first.`;
    });
  })();

  console.log(playerXScore);
  const displayMark = (object) => {
    // for loop (unsure which ) on object.element.children or all of the p elements in the div game cell and have it run
    // classList.contains to see if they have class ('x') or ('o') then toggle hidden class on that p element to mark it with the currentPlayer's mark
    if (reset === false) {
      console.log(object.element.children);
      const markArray = Array.from(object.element.children);
      console.log(object.playerX);
      for (const mark of markArray) {
        mark.classList.contains("x") && object.playerX === true
          ? mark.classList.remove("hidden")
          : mark.classList.contains("o") && object.playerO === true
          ? mark.classList.remove("hidden")
          : console.log("ternary"); // test
      }
    }
  };
  const removeMarks = (object) => {
    const markArray = Array.from(object.element.children);
    for (const mark of markArray) {
      if (!mark.classList.contains("hidden")) mark.classList.add("hidden");
    }
  };

  const addCellListener = (roundTrack, binaryPlayerChoice, rng) => {
    let patternArray;
    let pauseGameOuter;
    gameCellList.forEach((object) => {
      console.log(object);

      if (reset === false) {
        object.element.addEventListener("click", function (e) {
          binaryPlayerChoice(rng, object);

          console.log("round before reset", roundTrack.round);
          if (object.clicked === false && reset === false) {
            // if (submit === false) roundTrack.round = 0;
            console.log("round after reset", roundTrack.round);
            if (submit === true) {
              console.log(gameCellList);
              roundTrack.round++;

              console.log(rng);

              if (roundTrack.round > 0) {
                rng = !rng;
              }
              console.log(roundTrack);

              displayMark(object);

            
            }
          }
          object.clicked = true;
          const decideWinner = (function () {
            function pauseGame() {
              rematch.addEventListener("click", () => {
                reset = false;
                roundTrack.round = 0;
                gameCellList.forEach((object) => (object.clicked = true));
                rematch.classList.add("hidden");
                for (const object of gameCellList) {
                  const keys = Object.keys(object);
                  keys.forEach((key, index) => {
                    if (typeof object[key] === typeof false) {
                      console.log(`${key}: ${object[key]}`);
                      object[key] = false;
                    }
                  });
                  removeMarks(object);
                }
                winner.classList.add("hidden");
                firstPlayer.textContent = "";
              });
            }

            function passPattern() {
              if (reset === false) {
                let arr = [...arguments];

                let player = arr.shift();
                let playerName = arr.shift();
                console.log(arr);
                // console.log(player);

                patternArray = arr.filter((element) => {
                  if (
                    gameCellList[element - 1].gameCellNumber === element &&
                    gameCellList[element - 1][player] === true
                  ) {
                    // console.log(
                    //   "gamecell",
                    //   gameCellList[element - 1].gameCellNumber,
                    //   "arguments[i]",
                    //   element,
                    //   "player",
                    //   gameCellList[element - 1][player],
                    //   "equals",
                    //   true
                    // );
                    return element;
                  }
                });
                console.log(patternArray, arr);
                if (patternArray.toString() === arr.toString()) {
                  console.log(`${player} wins`);
                  rematch.classList.remove("hidden");

                  pauseGame();
                  console.log(player);
                  if (player === "playerX") {
                    playerXScoreNumber++;

                    playerXElement.innerText = `${playerXScore}: ${playerXScoreNumber}`;
                    playerOElement.innerText = `${playerOScore}: ${playerOScoreNumber}`;
                  } else if (player === "playerO") {
                    playerOScoreNumber++;

                    playerOElement.innerText = `${playerOScore}: ${playerOScoreNumber}`;
                    playerXElement.innerText = `${playerXScore}: ${playerXScoreNumber}`;
                  }

                  winner.classList.remove("hidden");
                  winner.innerText = `${
                    playerName.charAt(0).toUpperCase() + playerName.slice(1)
                  } Wins`;
                  reset = true;
                }
              }
            }
            // Player X
            passPattern("playerX", playerXScore, 1, 2, 3);
            passPattern("playerX", playerXScore, 4, 5, 6);
            passPattern("playerX", playerXScore, 7, 8, 9);
            passPattern("playerX", playerXScore, 1, 4, 7);
            passPattern("playerX", playerXScore, 2, 5, 8);
            passPattern("playerX", playerXScore, 3, 6, 9);
            passPattern("playerX", playerXScore, 1, 5, 9);
            passPattern("playerX", playerXScore, 3, 5, 7);

            // Player O
            passPattern("playerO", playerOScore, 1, 2, 3);
            passPattern("playerO", playerOScore, 4, 5, 6);
            passPattern("playerO", playerOScore, 7, 8, 9);
            passPattern("playerO", playerOScore, 1, 4, 7);
            passPattern("playerO", playerOScore, 2, 5, 8);
            passPattern("playerO", playerOScore, 3, 6, 9);
            passPattern("playerO", playerOScore, 1, 5, 9);
            passPattern("playerO", playerOScore, 3, 5, 7);
            return { pauseGame };
          })();
          pauseGameOuter = decideWinner.pauseGame;
          if (roundTrack.round === 9) {
            reset = true;
            console.log("end");
            rematch.classList.remove("hidden");

            pauseGameOuter();

            winner.innerText = `Stalemate`;
          }
        });
      }

      console.log(object.element);
      console.log(gameCellList);
    });
  };
  return { gameCellList, addCellListener };
})();
