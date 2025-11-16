var cells = document.querySelectorAll(".cell");
var statusText = document.getElementById("statusText");
var restartButton = document.getElementById("restartBtn");

// --- SOUND ELEMENTS ---
var soundX = new Audio("../assets/TicTacToe Sound Effects/whoosh0.mp3");
var soundO = new Audio("../assets/TicTacToe Sound Effects/whoosh1.mp3");
var soundWin = new Audio("../assets/TicTacToe Sound Effects/applause.mp3");
var soundDraw = new Audio("../assets/TicTacToe Sound Effects/mixkit-sad-game-over-trombone-471.wav");

// --- MUTE TOGGLE ---
var muteButton = document.getElementById("muteToggle");
var isMuted = false;

muteButton.addEventListener("click", function () {
  isMuted = !isMuted;
  muteButton.textContent = isMuted ? "🔊 Unmute Sounds" : "🔇 Mute Sounds";
});

// Central sound handler
function playSound(sound) {
  if (!isMuted) {
    sound.currentTime = 0;
    sound.play();
  }
}

  var currentPlayer = "X";
  var gameActive = true;

  var winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  statusText.textContent = currentPlayer + "'s turn";

  for (var i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function(event) {
      var clickedCell = event.target;

      if (clickedCell.textContent === "" && gameActive === true) {
        clickedCell.textContent = currentPlayer;

        checkWinner();

        if (gameActive === true) {
          if (currentPlayer === "X") {
            currentPlayer = "O";
            playSound(soundO);
          } else {
            currentPlayer = "X";
            playSound(soundX);
          }

          statusText.textContent = currentPlayer + "'s turn";
        }
      }
    });
  }

  restartButton.addEventListener("click", function() {
    for (var i = 0; i < cells.length; i++) {
      cells[i].textContent = "";
    }

    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = currentPlayer + "'s turn";
  });

  function checkWinner() {
    for (var i = 0; i < winningCombinations.length; i++) {
      var a = winningCombinations[i][0];
      var b = winningCombinations[i][1];
      var c = winningCombinations[i][2];

      var cellA = cells[a].textContent;
      var cellB = cells[b].textContent;
      var cellC = cells[c].textContent;

      if (cellA !== "" && cellA === cellB && cellB === cellC) {
        statusText.textContent = cellA + " wins!";
        gameActive = false;
        playSound(soundWin);
        return;
      }
    }

    var boardFull = true;

    for (var j = 0; j < cells.length; j++) {
      if (cells[j].textContent === "") {
        boardFull = false;
        break;
      }
    }

    if (boardFull === true) {
      statusText.textContent = "It's a draw!";
      gameActive = false;
      playSound(soundDraw);
    }
  }
