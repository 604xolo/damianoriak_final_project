const apikey = `9375fc46-4a12-40f1-bce5-3772a69687f1`
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
const rightword = document.getElementById(`rightword`)
start.addEventListener("click", newgame);


for(var i = 0; i < tryagainbttn.length; i++){
  tryagainbttn[i].addEventListener("click", tryagain)
}

for (var i = 0; i < letterbutton.length; i++) {
    letterbutton[i].addEventListener("click", guess) 
}

image = `<img id="hangmanimage" src="./images/hangedman${guesses}.svg" alt="an image of a partial hangman">`


function tryagain(){
  const nodeList= document.querySelectorAll("dialog");
  for (var i = 0; i < nodeList.length; i++) {
    nodeList[i].close() 
  }
  newgame();
}

async function fetchRandomWord() {
    const url = "https://random-word-api.vercel.app/api?words=1";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const randomword = await response.json();
      myword = randomword[0];
      console.log("Word Stored:", myword);
      wordarray.length = 0;
      wordarray = myword.split("");
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchdefinition(){
    const definitionUrl = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${myword}?key=${apikey}`
        try{
            const response = await fetch(definitionUrl);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
              }
              const definition = await response.json(); 
              if(!definition || !definition[0]?.shortdef?.[0]){
                console.warn(`No definition found for"${myword}". Fetching a new word...`);
                await fetchRandomWord();
                await fetchdefinition();
                return;
            }
              myworddefinition = definition[0].shortdef[0];
              console.log(definition[0].shortdef[0])
        }  catch (error){
            console.error(error.message);

        }
}

async function drawWord(){
    html = `<div class="text_container">`;
for(let i = 0; i < myword.length; i++){
html += `<div class="wordletter"> <p class="unguessed"> ${wordarray[i]}</p></div>`
}
html+= `</div>`
html+= `<div class="worddefinition"> <p><em>Hint: </em>${myworddefinition}</p> </div>`
}
  
async function newgame(){
    await fetchRandomWord();
    await fetchdefinition();
    myword.length;
   start.classList.add(`hide`);
   await drawWord();
   hangman.innerHTML = image;
   hangmantext.innerHTML = html;
   document.querySelectorAll('.letter').forEach(button => button.disabled = false);
   document.querySelectorAll('.letter').forEach(button => button.classList.remove(`selected`));
   document.querySelectorAll('.button-container').forEach(container => container.classList.add('enabled'));
   keyboard.classList.remove(`hide`);
   keyboard.classList.add(`showkeyboard`);
   guesses = 5;
}

function guess() {
  console.log(this.innerHTML);
  let letter = wordarray.find(letter => letter === this.innerHTML.toLowerCase());

  if (!letter) {
    guesses--;
    console.log(`Wrong guess! Remaining guesses: ${guesses}`);
  } else {
    // Find and reveal the correct letter
    const wordLetters = document.querySelectorAll('.wordletter p');
    wordLetters.forEach((element, i) => {
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

  if(guesses === 0 ){
    document.querySelectorAll('.letter').forEach(button => button.disabled = true);
    document.querySelectorAll('.button-container').forEach(container => container.classList.remove('enabled'));
    console.log(`You lost! The word was ${myword}.`)
    rightword.innerText = `The word was ${myword}.`;
    lose.show() 
  }
  // Update the hangman image
  const hangmanImage = document.getElementById('hangmanimage');
  if (hangmanImage) {
    hangmanImage.src = `./images/hangedman${guesses}.svg`;
  }

  this.disabled = true;
  this.classList.add('selected');
  this.parentNode.classList.remove('enabled');
}

