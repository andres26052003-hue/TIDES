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

let activeCard = null;
let activeType = null;

function changeScene(currentScene, nextScene){
  if(!currentScene || !nextScene){
    return;
  }

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

  if(currentScene === scene){
    return;
  }

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
        if(chapter.id === "prologue"){
          goToScene(prologue);
        }

        if(chapter.id === "chapter1"){
          goToScene(chapter1);
        }
      });
    }

    chaptersGrid.appendChild(card);
  });
}

startBtn.addEventListener("click", () => {
  goToScene(ready);
});

readyBtn.addEventListener("click", () => {
  goToScene(map);
});

backToIntro.addEventListener("click", () => {
  goToScene(intro);
});

continueBtn.addEventListener("click", () => {
  goToScene(map);
});

openBoardBtn.addEventListener("click", () => {
  goToScene(beachBoard);
});

backToChapter.addEventListener("click", () => {
  goToScene(chapter1);
});

boardToMap.addEventListener("click", () => {
  goToScene(map);
});

prologueBack.addEventListener("click", () => {
  goToScene(map);
});

startStoryFromPrologue.addEventListener("click", () => {
  goToScene(map);
});

prologueOptions.forEach((option) => {
  option.addEventListener("click", () => {
    alert(option.dataset.text);
  });
});

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
  if(!activeCard){
    return;
  }

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

renderChapters();

const bgVideo = document.getElementById("bgVideo");

if(bgVideo){
  bgVideo.muted = true;
  bgVideo.play().catch(() => {
    console.log("El navegador no permitió autoplay todavía.");
  });
}