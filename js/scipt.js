const apikey = `9375fc46-4a12-40f1-bce5-3772a69687f1`
let myword = "";
let myworddefinition = ""; 
const hangmanCanvas = document.getElementById 









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
              myworddefinition = definition[0].shortdef[0];
              console.log(definition[0].shortdef[0])
        }  catch (error){
            console.error(error.message);
        }


}
  
async function newgame(){
    await fetchRandomWord();
    await fetchdefinition();
    myword.length
}

 newgame()
  