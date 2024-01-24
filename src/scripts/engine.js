const state ={
  score:{
    playerScore:0,
    computerScore:0,
    scoreBox: document.getElementById("score-points"),
  },
  cardSprites:{
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards:{
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides:{
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerbox: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
}

const pathImagens = "./src/assets/icons/";
const cardData = [
  {
    id:0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImagens}dragon.png`,
    WinOf:[1],
    LoseOf:[2],
  },
  {
    id:1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImagens}magician.png`,
    WinOf:[2],
    LoseOf:[0],
  },
  {
    id:2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImagens}exodia.png`,
    WinOf:[0],
    LoseOf:[1],
  },
];

async function getRandonCardId(){
  const randonIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randonIndex].id;
}

async function createCardImage(idCard, fieldSide){
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if(fieldSide === state.playerSides.player1){
    cardImage.addEventListener("mouseover", ()=>{
      drawSelectCard(idCard);
    });

    cardImage.addEventListener("click", ()=>{
      setCardsfield(cardImage.getAttribute("data-id"));
    })
  }

  return cardImage;
}

async function setCardsfield(cardId){
  await removeAllCardsImages();

  let computerCardId = await getRandonCardId();

  await showHiddenCardFieldsImages(true);

  await hiddenCardDetails();

  await drawCardsInField(cardId, computerCardId);

  let duelResults = await checkDuelResults(cardId, computerCardId); 

  await updateScore();
  await drawButton(duelResults); 
}

async function drawCardsInField(cardId, computerCardId){
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value){
  if(value === true){
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }else{
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

async function hiddenCardDetails(){
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.cardSprites.avatar.src = "";
}

async function drawButton(text){
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore(){
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if(playerCard.WinOf.includes(computerCardId)){
    duelResults = "win";
    state.score.playerScore++;
  }

  if(playerCard.LoseOf.includes(computerCardId)){
    duelResults = "lose";
    state.score.computerScore++;
  }
  await playAudio(duelResults);
  
  return duelResults;
}

async function removeAllCardsImages(){
  let {computerbox, player1Box} = state.playerSides;
  let imgElements = computerbox.querySelectorAll("img");
  imgElements.forEach((img)=> img.remove());

  imgElements = player1Box.querySelectorAll("img");
  imgElements.forEach((img)=> img.remove());
}

async function drawSelectCard(id){
  state.cardSprites.avatar.src = cardData[id].img;
  state.cardSprites.name.innerText = cardData[id].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[id].type;
}

async function drawCards(cardNumbers, fieldSide){
  for(let i = 0; i < cardNumbers; i++){
    const randomIdCard = await getRandonCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);
    
    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel(){
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "uma carta";

  init();
}

async function playAudio(status){
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.volume = 0.2;
  audio.play();
}

function init(){
  showHiddenCardFieldsImages(false);
  drawCards(5, state.playerSides.player1);
  drawCards(5, state.playerSides.computer);

  const bgm = document.getElementById("bgm");  
  bgm.volume = 0.2;
  bgm.play();
}

init();