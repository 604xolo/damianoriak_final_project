const apikey = `9375fc46-4a12-40f1-bce5-3772a69687f1`;
let myword = "";
let myworddefinition = ""; 
const hangman = document.getElementById(`hangman`);
const hangmantext = document.getElementById(`text`);
const start = document.getElementById(`start-game`);
const keyboard = document.getElementById(`keyboard`);
let html = ``;
let image = ``;
let wordarray = [];
let guesses = 5;
const letterbutton = document.getElementsByClassName(`letter`);
const tryagainbttn = document.getElementsByClassName(`try-again`);
const win = document.getElementById(`win`);
const lose = document.getElementById(`lose`);
const rightword = document.getElementById(`rightword`);
start.addEventListener("click", newgame);

// Utility class for dialog handling
class DialogHandler {
  static closeAllDialogs() {
    const nodeList = document.querySelectorAll("dialog");
    nodeList.forEach(dialog => dialog.close());
  }
}

for (let button of tryagainbttn) {
  button.addEventListener("click", () => {
    DialogHandler.closeAllDialogs();
    newgame();
  });
}

for (let button of letterbutton) {
  button.addEventListener("click", guess);
}

image = `<img id="hangmanimage" src="./images/hangedman${guesses}.svg" alt="an image of a partial hangman">`;

async function fetchRandomWord() {
  const url = "https://random-word-api.vercel.app/api?words=1";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const randomword = await response.json();
    myword = randomword[0];
    console.log("Word Stored:", myword);
    wordarray = myword.split("");
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchdefinition() {
  const definitionUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${myword}?key=${apikey}`;
  try {
    const response = await fetch(definitionUrl);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const definition = await response.json();
    if (!definition || !definition[0]?.shortdef?.[0]) {
      console.warn(`No definition found for "${myword}". Fetching a new word...`);
      await fetchRandomWord();
      await fetchdefinition();
      return;
    }
    myworddefinition = definition[0].shortdef[0];
    console.log(definition[0].shortdef[0]);
  } catch (error) {
    console.error(error.message);
  }
}

async function drawWord() {
  html = `<div class="text_container">`;
  for (let i = 0; i < myword.length; i++) {
    html += `<div class="wordletter"> <p class="unguessed"> ${wordarray[i]}</p></div>`;
  }
  html += `</div>`;
  html += `<div class="worddefinition"> <p><em>Hint: </em>${myworddefinition}</p> </div>`;
}

async function newgame() {
  await fetchRandomWord();
  await fetchdefinition();
  start.classList.add(`hide`);
  await drawWord();
  hangman.innerHTML = image;
  hangmantext.innerHTML = html;
  document.querySelectorAll('.letter').forEach(button => {
    button.disabled = false;
    button.classList.remove(`selected`);
  });
  document.querySelectorAll('.button-container').forEach(container => container.classList.add('enabled'));
  keyboard.classList.remove(`hide`);
  keyboard.classList.add(`showkeyboard`);
  guesses = 5;
}

function guess() {
  console.log(this.innerHTML);
  const letter = wordarray.find(letter => letter === this.innerHTML.toLowerCase());

  if (!letter) {
    guesses--;
    console.log(`Wrong guess! Remaining guesses: ${guesses}`);
  } else {
    document.querySelectorAll('.wordletter p').forEach((element, i) => {
      if (wordarray[i] === this.innerHTML.toLowerCase()) {
        element.classList.remove('unguessed');
      }
    });
  }

  if (document.querySelectorAll('.unguessed').length === 0) {
    document.querySelectorAll('.letter').forEach(button => button.disabled = true);
    document.querySelectorAll('.button-container').forEach(container => container.classList.remove('enabled'));
    console.log(`You Won!`);
    win.show();
  }

  if (guesses === 0) {
    document.querySelectorAll('.letter').forEach(button => button.disabled = true);
    document.querySelectorAll('.button-container').forEach(container => container.classList.remove('enabled'));
    console.log(`You lost! The word was ${myword}.`);
    rightword.innerText = `The word was ${myword}.`;
    lose.show();
  }

  const hangmanImage = document.getElementById('hangmanimage');
  if (hangmanImage) {
    hangmanImage.src = `./images/hangedman${guesses}.svg`;
  }

  this.disabled = true;
  this.classList.add('selected');
  this.parentNode.classList.remove('enabled');
}
