import { WORDS, VALID_GUESSES } from "./words.js";

// ==========================================================
// Game setup variables
// ==========================================================
const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let previousGuesses = [];
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);
let gameOver = false;
let isRevealing = false;

// ==========================================================
// Initialize the board
// ==========================================================

function initBoard() {
  const board = document.getElementById("game-board");

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    const row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < 5; j++) {
      const box = document.createElement("div");
      box.className = "letter-box";
      box.id = `box${i}${j}`;
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}
initBoard();

// ==========================================================
// Helper Functions (defined before the keyboard setup)
// ==========================================================

function getCurrentRow() {
  // Returns the active row based on how many guesses are left
  return document.getElementsByClassName("letter-row")[
    NUMBER_OF_GUESSES - guessesRemaining
  ];
}

// Returns one specific box in the current row
function getBox(index) {
  const row = getCurrentRow();
  return row.children[index];
}

function insertLetter(letter) {
  if (gameOver || isRevealing) return;
  if (nextLetter === 5) return;
  const box = getBox(nextLetter);
  box.textContent = letter.toUpperCase();
  box.classList.add("filled-box");
  currentGuess.push(letter);
  nextLetter++;
}

function deleteLetter() {
  if (gameOver || isRevealing) return;
  if (nextLetter === 0) return;
  nextLetter--;
  const box = getBox(nextLetter);
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
}

function updateKeyColor(letter, color) {
  const btn = [...document.querySelectorAll(".key")].find(
    (k) => (k.dataset.key || k.textContent).toUpperCase() === letter
  );
  if (!btn) return;

  const priority = { "#787c7e": 1, "#c9b458": 2, "#6aaa64": 3 }; // gray < yellow < green
  const current = getComputedStyle(btn).backgroundColor;
  const toPriority = (c) =>
    ({
      "rgb(120, 124, 126)": 1,
      "rgb(201, 180, 88)": 2,
      "rgb(106, 170, 100)": 3,
    }[c] || 0);

  if (toPriority(current) < priority[color]) {
    btn.style.backgroundColor = color;
    btn.style.borderColor = color;
    btn.style.color = "#fff";
  }
}

// Handles checking the current guess (temporary: just logs it)
function checkGuess() {
  if (gameOver || isRevealing) return;

  const guess = currentGuess.join("").toUpperCase();

  // --- Prevent duplicate guesses ---
  if (previousGuesses.includes(guess)) {
    shakeActiveRow();
    toast("You already tried that word!");
    disableEnterTemporarily();
    return;
  }

  // --- Validation ---
  if (guess.length < 5) {
    shakeActiveRow();
    toast("Not enough letters!");
    return;
  }

  if (!VALID_GUESSES.includes(guess)) {
    shakeActiveRow();
    toast("Not a valid word!");
    return;
  }

  previousGuesses.push(guess);

  // Color logic
  const row = getCurrentRow();
  const rightWord = rightGuessString.toUpperCase();
  const guessLetters = guess.split("");

  // Build frequency map for target
  const counts = {};
  for (const ch of rightWord) {
    counts[ch] = (counts[ch] || 0) + 1;
  }

  // First pass: mark correct (green)
  const colors = Array(5).fill("gray");
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === rightWord[i]) {
      colors[i] = "green";
      counts[guessLetters[i]] -= 1; // consume this letter from the target pool
    }
  }

  // Second pass: mark present (yellow) if leftover count
  for (let i = 0; i < 5; i++) {
    if (colors[i] === "green") continue;
    const ch = guessLetters[i];
    if (counts[ch] > 0) {
      colors[i] = "yellow";
      counts[ch] -= 1; // consume
    }
  }

  isRevealing = true; // block new input during animations

  // Apply colors during the flip animation
  for (let i = 0; i < 5; i++) {
    const box = row.children[i];
    const letter = guessLetters[i];

    setTimeout(() => {
      box.classList.add("flip");

      setTimeout(() => {
        if (colors[i] === "green") {
          box.style.backgroundColor = "#6aaa64";
          box.style.borderColor = "#6aaa64";
          updateKeyColor(letter, "#6aaa64");
        } else if (colors[i] === "yellow") {
          box.style.backgroundColor = "#c9b458";
          box.style.borderColor = "#c9b458";
          updateKeyColor(letter, "#c9b458");
        } else {
          box.style.backgroundColor = "#787c7e";
          box.style.borderColor = "#787c7e";
          updateKeyColor(letter, "#787c7e");
        }
      }, 250);
    }, i * 350);
  }

  // --- Move to next row ---
  guessesRemaining--;
  currentGuess = [];
  nextLetter = 0;

  // --- Win or Lose with popup (delayed for flip animation) ---
  if (guess === rightWord) {
    const guessesUsed = NUMBER_OF_GUESSES - guessesRemaining;
    const score = Math.max(0, 60 - (guessesUsed - 1) * 10);
    gameOver = true;

    const kb = document.getElementById("keyboard-container");
    if (kb) kb.classList.add("disabled");

    // Wait ~1.8 seconds for all 5 tiles to finish flipping
    setTimeout(() => {
      showPopup("🎉 You guessed it!", score, guessesUsed);
    }, 1800);
  } else if (guessesRemaining === 0) {
    const guessesUsed = NUMBER_OF_GUESSES;
    gameOver = true;

    const kb = document.getElementById("keyboard-container");
    if (kb) kb.classList.add("disabled");

    // Delay popup too for consistency
    setTimeout(() => {
      showPopup("😢 Game over!", 0, guessesUsed);
    }, 1800);
  }

  // Allow input again after reveal animations
  setTimeout(() => {
    isRevealing = false;
  }, 1800);
}

function toast(message, duration = 1200) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = message;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), duration);
}

function disableEnterTemporarily() {
  const enterKey = [...document.querySelectorAll(".key")].find(
    (k) => k.textContent.toLowerCase() === "enter"
  );
  if (!enterKey) return;
  enterKey.disabled = true;
  setTimeout(() => (enterKey.disabled = false), 400);
}

// helper to shake the active row (invalid word / too short)
function shakeActiveRow() {
  const row = getCurrentRow();
  if (!row) return;
  row.classList.add("shake");
  setTimeout(() => row.classList.remove("shake"), 320);
}

function newGame() {
  // Reset all core variables
  guessesRemaining = NUMBER_OF_GUESSES;
  currentGuess = [];
  nextLetter = 0;
  gameOver = false;
  previousGuesses = [];
  isRevealing = false;

  // Rebuild a fresh empty game board
  const board = document.getElementById("game-board");
  board.innerHTML = ""; // remove old rows completely
  initBoard(); // create new empty rows

  // Pick a new random target word
  rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
  console.log("New word:", rightGuessString);

  // Reset keyboard colors
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => {
    key.style.backgroundColor = "";
    key.style.borderColor = "";
    key.style.color = "";
  });

  // Remove dimming if keyboard was disabled
  const kb = document.getElementById("keyboard-container");
  if (kb) kb.classList.remove("disabled");

  // Hide popup if visible
  const overlay = document.getElementById("popup-overlay");
  if (overlay) overlay.classList.remove("show");

  // Toast feedback
  toast("New game started!");

  // Return focus to the main document
  setTimeout(() => {
    document.activeElement.blur(); // removes focus from button
    window.focus(); // ensures the window regains input focus
  }, 100);
}

function showPopup(resultText, score, guessesUsed) {
  const overlay = document.getElementById("popup-overlay");
  const title = document.getElementById("popup-title");
  const scoreEl = document.getElementById("popup-score");
  const guessesEl = document.getElementById("popup-guesses");
  const btn = document.getElementById("popup-btn");

  // Show the correct word in the popup
  const wordEl = document.createElement("p");
  wordEl.id = "popup-word";
  wordEl.style.fontWeight = "bold";
  wordEl.style.fontSize = "1.1rem";
  wordEl.style.color = "#333";
  wordEl.style.marginTop = "6px";
  wordEl.textContent = `The word was: ${rightGuessString.toUpperCase()}`;

  // Update popup content
  title.textContent = resultText;
  scoreEl.textContent = `Your score: ${score} / 60`;
  guessesEl.textContent = `Guesses used: ${guessesUsed}`;

  // Remove any old “word” line if it exists (avoid duplicates)
  const oldWord = document.getElementById("popup-word");
  if (oldWord) oldWord.remove();

  // Append the word line *before* the button
  const box = document.getElementById("popup-box");
  box.insertBefore(wordEl, btn);

  // Show popup
  overlay.classList.add("show");

  // Button → start new game
  btn.onclick = () => {
    overlay.classList.remove("show");
    newGame();
  };
}

// ==========================================================
// Create the On-Screen Keyboard
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {
  // Code to create the keyboard goes inside this function

  console.log("The page's HTML is fully loaded. Now creating the keyboard!");

  // 1. Get the container where the keyboard will go
  const keyboardContainer = document.getElementById("keyboard-container");

  // 2. Define the keyboard layout
  const keyboardLayout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
  ];

  // 3. Loop through the layout and create the button elements
  keyboardLayout.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("keyboard-row");

    row.forEach((key) => {
      const keyElement = document.createElement("button");
      keyElement.textContent = key;
      keyElement.classList.add("key");

      if (key === "Enter" || key === "Backspace") {
        keyElement.classList.add("wide-key");
      }

      if (key === "Backspace") {
        keyElement.setAttribute("aria-label", "Backspace");
        keyElement.dataset.key = "Backspace";
        keyElement.innerHTML = `
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="20"
           viewBox="0 0 24 24" width="20" class="game-icon" data-testid="icon-backspace">
        <path fill="var(--color-tone-1)"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z">
        </path>
      </svg>`;
      } else {
        keyElement.textContent = key;
      }

      // Add click listener for functionality
      keyElement.addEventListener("click", () => {
        if (gameOver) return;

        if (key === "Enter") {
          checkGuess();
        } else if (key === "Backspace") {
          deleteLetter();
        } else {
          insertLetter(key);
        }
      });

      rowElement.appendChild(keyElement);
    });

    keyboardContainer.appendChild(rowElement);
  });
});

// ==========================================================
// Physical Keyboard Support
// ==========================================================

document.addEventListener("keydown", (event) => {
  if (gameOver || isRevealing) return;

  const key = event.key;

  if (key === "Enter") {
    checkGuess();
  } else if (key === "Backspace") {
    deleteLetter();
  } else if (/^[a-zA-Z]$/.test(key)) {
    // uses regex to check for valid letter
    insertLetter(key.toLowerCase());
  }
});
