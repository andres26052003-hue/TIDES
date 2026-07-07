const intro = document.getElementById("intro");
const ready = document.getElementById("ready");
const map = document.getElementById("map");
const chapter0 = document.getElementById("chapter0");
const beachBoard = document.getElementById("beachBoard");

const startBtn = document.getElementById("startBtn");
const readyBtn = document.getElementById("readyBtn");
const continueBtn = document.getElementById("continueBtn");
const openBoardBtn = document.getElementById("openBoardBtn");
const backToIntro = document.getElementById("backToIntro");
const backToChapter = document.getElementById("backToChapter");
const boardToMap = document.getElementById("boardToMap");
const chapterTiles = document.querySelectorAll(".chapter-tile.completed");

const mediaCards = document.querySelectorAll(".media-card");
const mediaModal = document.getElementById("mediaModal");
const modalImage = document.getElementById("modalImage");
const modalVideo = document.getElementById("modalVideo");
const closeModal = document.getElementById("closeModal");

let activeCard = null;
let activeType = null;

function changeScene(currentScene, nextScene){
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
  goToScene(chapter0);
});

boardToMap.addEventListener("click", () => {
  goToScene(map);
});

chapterTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const target = tile.getAttribute("data-target");

    if(target === "chapter0"){
      goToScene(chapter0);
    }
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