const intro = document.getElementById("intro");
const ready = document.getElementById("ready");
const map = document.getElementById("map");
const chapter1 = document.getElementById("chapter1");
const beachBoard = document.getElementById("beachBoard");
const prologue = document.getElementById("prologue");

const startBtn = document.getElementById("startBtn");
const readyBtn = document.getElementById("readyBtn");
const continueBtn = document.getElementById("continueBtn");
const openBoardBtn = document.getElementById("openBoardBtn");
const backToIntro = document.getElementById("backToIntro");
const backToChapter = document.getElementById("backToChapter");
const boardToMap = document.getElementById("boardToMap");
const chaptersGrid = document.getElementById("chaptersGrid");

const prologueBack = document.getElementById("prologueBack");
const startStoryFromPrologue = document.getElementById("startStoryFromPrologue");
const prologueOptions = document.querySelectorAll(".prologue-option");

const mediaCards = document.querySelectorAll(".media-card");
const mediaModal = document.getElementById("mediaModal");
const modalImage = document.getElementById("modalImage");
const modalVideo = document.getElementById("modalVideo");
const closeModal = document.getElementById("closeModal");

const beachLetterBtn = document.getElementById("beachLetterBtn");
const beachLetterModal = document.getElementById("beachLetterModal");
const closeBeachLetter = document.getElementById("closeBeachLetter");

const prologueImageModal = document.getElementById("prologueImageModal");
const prologueImage = document.getElementById("prologueImage");
const closePrologueImage = document.getElementById("closePrologueImage");

let activeCard = null;
let activeType = null;
let activePrologueObject = null;

function changeScene(currentScene, nextScene){
  if(!currentScene || !nextScene) return;

  currentScene.classList.remove("active");

  setTimeout(() => {
    nextScene.classList.add("active");
  }, 650);
}

function getActiveScene(){
  return document.querySelector(".scene.active");
}

function goToScene(scene){
  const currentScene = getActiveScene();
  if(currentScene === scene) return;
  changeScene(currentScene, scene);
}

function isUnlocked(chapter){
  const today = new Date();
  const unlockDate = new Date(chapter.unlockDate + "T00:00:00");
  return today >= unlockDate;
}

function renderChapters(){
  chaptersGrid.innerHTML = "";

  chapters.forEach((chapter, index) => {
    const unlocked = isUnlocked(chapter);
    const card = document.createElement("article");

    card.className = `chapter-tile ${unlocked ? "completed" : "locked"} ${index < 2 ? "large" : ""}`;
    card.setAttribute("data-target", chapter.id);

    if(unlocked && chapter.cardImage){
      card.style.backgroundImage = `
        linear-gradient(rgba(6,20,35,.25),rgba(6,20,35,.38)),
        url('${chapter.cardImage}')
      `;
      card.style.backgroundSize = "cover";
      card.style.backgroundPosition = "center";
    }

    card.innerHTML = `
      <span class="chapter-number">${chapter.number}</span>
      <div class="chapter-icon">${unlocked ? "〰" : "🔒"}</div>
      <p>${chapter.label}</p>
      <h3>${chapter.title}</h3>
      ${
        unlocked
        ? `<button>${chapter.buttonText}</button>`
        : `<span>${chapter.buttonText}</span>`
      }
    `;

    if(unlocked){
      card.addEventListener("click", () => {
        if(chapter.id === "prologue") goToScene(prologue);
        if(chapter.id === "chapter1") goToScene(chapter1);
      });
    }

    chaptersGrid.appendChild(card);
  });
}

startBtn.addEventListener("click", () => goToScene(ready));
readyBtn.addEventListener("click", () => goToScene(map));
backToIntro.addEventListener("click", () => goToScene(intro));
continueBtn.addEventListener("click", () => goToScene(map));
openBoardBtn.addEventListener("click", () => goToScene(beachBoard));
backToChapter.addEventListener("click", () => goToScene(chapter1));
boardToMap.addEventListener("click", () => goToScene(map));
prologueBack.addEventListener("click", () => goToScene(map));
startStoryFromPrologue.addEventListener("click", () => goToScene(map));

prologueOptions.forEach((option) => {
  option.addEventListener("click", () => {
    activePrologueObject = option;

    const rect = option.getBoundingClientRect();

    prologueImage.src = option.dataset.img;
    prologueImageModal.classList.add("active");

    prologueImage.style.left = rect.left + "px";
    prologueImage.style.top = rect.top + "px";
    prologueImage.style.width = rect.width + "px";
    prologueImage.style.height = rect.height + "px";
    prologueImage.style.opacity = "0";

    requestAnimationFrame(() => {
      const targetWidth = Math.min(window.innerWidth * 0.9, 460);
      const targetHeight = Math.min(window.innerHeight * 0.78, 700);

      prologueImage.style.left = (window.innerWidth - targetWidth) / 2 + "px";
      prologueImage.style.top = (window.innerHeight - targetHeight) / 2 + "px";
      prologueImage.style.width = targetWidth + "px";
      prologueImage.style.height = targetHeight + "px";
      prologueImage.style.opacity = "1";
    });
  });
});

function closePrologueImageModal(){
  if(!activePrologueObject) return;

  const rect = activePrologueObject.getBoundingClientRect();

  prologueImage.style.left = rect.left + "px";
  prologueImage.style.top = rect.top + "px";
  prologueImage.style.width = rect.width + "px";
  prologueImage.style.height = rect.height + "px";
  prologueImage.style.opacity = "0";

  setTimeout(() => {
    prologueImageModal.classList.remove("active");
    prologueImage.src = "";
    activePrologueObject = null;
  }, 550);
}

if(closePrologueImage){
  closePrologueImage.addEventListener("click", closePrologueImageModal);
}

if(prologueImageModal){
  prologueImageModal.addEventListener("click", (e) => {
    if(e.target.classList.contains("prologue-image-bg")){
      closePrologueImageModal();
    }
  });
}

mediaCards.forEach((card) => {
  card.addEventListener("click", () => {
    if(card.dataset.video){
      openMedia(card, "video");
    }else{
      openMedia(card, "image");
    }
  });
});

function openMedia(card, type){
  activeCard = card;
  activeType = type;

  const rect = card.getBoundingClientRect();

  mediaModal.classList.add("active");

  if(type === "image"){
    modalVideo.pause();
    modalVideo.style.display = "none";
    modalImage.style.display = "block";
    modalImage.src = card.dataset.img;
    animateOpen(modalImage, rect);
  }

  if(type === "video"){
    modalImage.style.display = "none";
    modalImage.src = "";
    modalVideo.style.display = "block";
    modalVideo.src = card.dataset.video;
    modalVideo.controls = true;
    animateOpen(modalVideo, rect);

    setTimeout(() => {
      modalVideo.play();
    }, 500);
  }
}

function animateOpen(element, rect){
  element.style.left = rect.left + "px";
  element.style.top = rect.top + "px";
  element.style.width = rect.width + "px";
  element.style.height = rect.height + "px";

  requestAnimationFrame(() => {
    const targetWidth = Math.min(window.innerWidth * 0.88, 720);
    const targetHeight = Math.min(window.innerHeight * 0.72, 640);

    element.style.left = (window.innerWidth - targetWidth) / 2 + "px";
    element.style.top = (window.innerHeight - targetHeight) / 2 + "px";
    element.style.width = targetWidth + "px";
    element.style.height = targetHeight + "px";
  });
}

function closeMedia(){
  if(!activeCard) return;

  const rect = activeCard.getBoundingClientRect();
  const element = activeType === "video" ? modalVideo : modalImage;

  element.style.left = rect.left + "px";
  element.style.top = rect.top + "px";
  element.style.width = rect.width + "px";
  element.style.height = rect.height + "px";

  setTimeout(() => {
    modalVideo.pause();
    modalVideo.src = "";
    modalImage.src = "";

    modalImage.style.display = "none";
    modalVideo.style.display = "none";

    mediaModal.classList.remove("active");

    activeCard = null;
    activeType = null;
  }, 550);
}

closeModal.addEventListener("click", closeMedia);

mediaModal.addEventListener("click", (e) => {
  if(e.target.classList.contains("modal-bg")){
    closeMedia();
  }
});

const beachLetterImage = document.getElementById("beachLetterImage");

if(beachLetterBtn){
  beachLetterBtn.addEventListener("click", () => {
    const rect = beachLetterBtn.getBoundingClientRect();

    beachLetterImage.src = "assets/playa/carta-playa.jpg";
    beachLetterModal.classList.add("active");

    beachLetterImage.style.left = rect.left + "px";
    beachLetterImage.style.top = rect.top + "px";
    beachLetterImage.style.width = rect.width + "px";
    beachLetterImage.style.height = rect.height + "px";
    beachLetterImage.style.opacity = "0";

    requestAnimationFrame(() => {
      const targetWidth = Math.min(window.innerWidth * 0.9, 460);
      const targetHeight = Math.min(window.innerHeight * 0.82, 720);

      beachLetterImage.style.left = (window.innerWidth - targetWidth) / 2 + "px";
      beachLetterImage.style.top = (window.innerHeight - targetHeight) / 2 + "px";
      beachLetterImage.style.width = targetWidth + "px";
      beachLetterImage.style.height = targetHeight + "px";
      beachLetterImage.style.opacity = "1";
    });
  });
}

function closeBeachLetterModal(){
  if(!beachLetterBtn || !beachLetterImage || !beachLetterModal){
    return;
  }

  const rect = beachLetterBtn.getBoundingClientRect();

  beachLetterImage.style.left = rect.left + "px";
  beachLetterImage.style.top = rect.top + "px";
  beachLetterImage.style.width = rect.width + "px";
  beachLetterImage.style.height = rect.height + "px";
  beachLetterImage.style.opacity = "0";

  setTimeout(() => {
    beachLetterModal.classList.remove("active");
    beachLetterImage.src = "";
  }, 550);
}

if(closeBeachLetter){
  closeBeachLetter.addEventListener("click", closeBeachLetterModal);
}

if(beachLetterModal){
  beachLetterModal.addEventListener("click", (e) => {
    if(e.target.classList.contains("beach-letter-bg")){
      closeBeachLetterModal();
    }
  });
}

  setTimeout(() => {
    beachLetterModal.classList.remove("active");
  }, 550);


renderChapters();

const bgVideo = document.getElementById("bgVideo");

if(bgVideo){
  bgVideo.muted = true;
  bgVideo.play().catch(() => {
    console.log("El navegador no permitió autoplay todavía.");
  });
}