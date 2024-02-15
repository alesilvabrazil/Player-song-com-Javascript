// Elementos HTML
const songName = document.getElementById('song-name'); // Nome da música
const bandName = document.getElementById('band-name'); // Nome da banda/artista
const song = document.getElementById('audio'); // Elemento de áudio
const cover = document.getElementById('cover'); // Elemento da capa do álbum
const play = document.getElementById('play'); // Botão de play/pause
const next = document.getElementById('next'); // Botão de próxima música
const previous = document.getElementById('previous'); // Botão de música anterior
const likeButton = document.getElementById('like'); // Botão de like
const currentProgress = document.getElementById('current-progress'); // Elemento de progresso da música
const progressContainer = document.getElementById('progress-container'); // Container da barra de progresso
const shuffleButton = document.getElementById('shuffle'); // Botão de embaralhar
const repeatButton = document.getElementById('repeat'); // Botão de repetir
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

// Estados do player
let isPlaying = false; // Verifica se a música está sendo reproduzida
let isShuffled = false; // Verifica se a playlist está embaralhada
let repeatOn = false; // Verifica se a repetição está ativada

// Objetos representando músicas
const alucinacao = {
    songName: 'Alucinação',
    artist: 'Belchior',
    file: 'alucinacao',
    liked : false
};

const sugar = {
    songName: 'Sugar',
    artist: 'Maroon 5',
    file: 'sugar',
    liked : true
};

const indestructible = {
    songName: 'Indestructible',
    artist: 'Disturbed',
    file: 'disturbedindestructible',
    liked : false
};

// Função para reproduzir a música
function playSong() {
    song.play();
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    isPlaying = true;
}

// Função para pausar a música
function pauseSong() {
    song.pause();
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    isPlaying = false;
}

// Lista de reprodução original e embaralhada
const originalplayList = JSON.parse(localStorage.getItem('playlist')) ?? [
    
    alucinacao,
    sugar,
    indestructible
];
let sortedPlaylist = [...originalplayList];
let index = 0;

// Função para decidir entre reproduzir ou pausar
function playPauseDecider() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Função para inicializar a música atual
function initializeSong() {
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

// Função para ir para a música anterior
function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    } else {
        index -= 1;
    }
    initializeSong();
    playSong();
}

// Função para ir para a próxima música
function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    initializeSong();
    playSong();
}

// Função para atualizar a barra de progresso
function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

// Função para pular para uma posição na música ao clicar na barra de progresso
function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

// Função para lidar com o clique no botão de embaralhar
function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalplayList];
        shuffleButton.classList.remove('button-active');
    }
}

// Função para embaralhar uma array
function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;

    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        let temp = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = temp;
        currentIndex -= 1;
    }
}

// Função para lidar com o clique no botão de repetir
// Função para lidar com o clique no botão de repetir
function repeatButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');  // Corrigido aqui
    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-active');  // Corrigido aqui
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    } else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender() {
    if(sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.classList.remove('button-active');
    }
}

function likeButtonClicked() {
    if(sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    } 
    likeButtonRender();
    localStorage.setItem('playlist',JSON.stringify(originalplayList));
}

// Inicialização da música e associação de eventos aos botões
initializeSong();
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime)
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);
