const audioPlayer = document.querySelector('.app');
const audio = audioPlayer.querySelector('.audio');
const buttonPlay = audioPlayer.querySelector('.button-play');
const cover = audioPlayer.querySelector('.song-info__cover');
const volume = audioPlayer.querySelector('.volume');
const volumeIconLow = audioPlayer.querySelector('.low')
const currTimeElement = audioPlayer.querySelector('.current');
const durationElement = audioPlayer.querySelector('.duration');
const progress = audioPlayer.querySelector('.progress');
const back = audioPlayer.querySelector('.button-backward');
const forward = audioPlayer.querySelector('.button-forward');

let isPlay = false;

// Play and pause audio
function playPauseAudio() {
    if (!isPlay) {
        buttonPlay.className = 'button button-pause';
        audio.play();
        cover.classList.add('playing');
        isPlay = true;
    } else {
        buttonPlay.className = 'button button-play';
        audio.pause();
        cover.classList.remove('playing');
        isPlay = false;
    };
};

buttonPlay.addEventListener('click', playPauseAudio);

// Volume
volume.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    if (audio.volume === 0) {
        volumeIconLow.classList.add('mute');
    } else {
        volumeIconLow.classList.remove('mute');
    };
});

// Current time and duration
function currentTime() {
    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (!isNaN(audio.duration)) {
        durationElement.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' + durationSeconds : durationSeconds}`;
    }
    currTimeElement.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' + currentSeconds : currentSeconds}`;
    
};

audio.addEventListener('loadedmetadata', () => {
    progress.value = 0;
    audio.volume = 0.2;
    currentTime();
});
audio.addEventListener('timeupdate', currentTime);

// Progress bar
audio.addEventListener('timeupdate', () => {
    progress.value = (audio.currentTime / audio.duration);
});

function handleSeek(e) {
    const progressTime = (e.offsetX / progress.offsetWidth) * audio.duration;
    audio.currentTime = progressTime;
};

progress.addEventListener('click', handleSeek);
progress.addEventListener('change', () => {
    audio.currentTime = progress.value;
});

//  Playlist open/close
const playlistOpen = document.querySelector('.playlist');
const playlistLink = document.querySelector('.header__playlist-link');
let isOpen = false;

playlistLink.addEventListener('click', () => {
    if (!isOpen) {
        playlistOpen.classList.add('open');
        playlistLink.innerText = 'playlist->';
        isOpen = true;
    } else {
        playlistOpen.classList.remove('open');
        playlistLink.innerText = '<-playlist';
        isOpen = false;
    };
});

// Chage songs
let playlist = Array.from(document.querySelectorAll('.playlist__song'));
const name = document.querySelector('.description__song-name');
const author = document.querySelector('.description__author-name');
let songs = [
    {
        name: 'Mariage D\'Amour',
        cover: './assets/cover/George_Davidson-Mariage_DAmour.jpg',
        author: 'George Davidson',
        audio: './assets/audio/George_Davidson-Mariage_DAmour.mp3',
        id: 0,
    },
    {
        name: 'Charming Smile',
        cover: './assets/cover/Egor_Grushin-Charming_Smile.jpg',
        author: 'Egor Grushin',
        audio: './assets/audio/Egor_Grushin-Charming_Smile.mp3',
        id: 1,
    },
    {
        name: 'Historia de un Amor',
        cover: './assets/cover/Giovanni_Marradi-Historia_de_un_Amor.jpg',
        author: 'Giovanni Marradi',
        audio: './assets/audio/Giovanni_Marradi-Historia_de_un_Amor.mp3',
        id: 2,
    },
    {
        name: 'Veloma',
        cover: './assets/cover/Fabrizio_Paterlini-Veloma.jpg',
        author: 'Fabrizio Paterlini',
        audio: './assets/audio/Fabrizio_Paterlini-Veloma.mp3',
        id: 3,
    },
];

function playSong(song) {
    cover.src = song.cover;
    name.innerText = song.name;
    author.innerText = song.author;
    audio.src = song.audio;
    isPlay = false;
    playPauseAudio();
};

function switchSong(button) {
    const selectedSong = document.querySelector('.selected');
    const selectedSongIndex = playlist.indexOf(selectedSong);
    selectedSong.classList.remove('selected');

    if (button === 'backward') {
        let previousSong = playlist[selectedSongIndex - 1];
        if (playlist.indexOf(previousSong) === -1) {
            previousSong = playlist[playlist.length - 1];
        };
        previousSong.classList.add('selected');
        songs.filter((song) => {
            if (song.id == previousSong.id) {
                playSong(song);
            };
        });
    } else if (button === 'forward') {
        let nextSong = playlist[selectedSongIndex + 1];
        if (playlist.indexOf(nextSong) === -1) {
            nextSong = playlist[0];
        };
        nextSong.classList.add('selected');
        songs.filter((song) => {
            if (song.id == nextSong.id) {
                playSong(song);
            };
        });
    };
};

back.addEventListener('click', () => switchSong('backward'));
forward.addEventListener('click', () => switchSong('forward'));
audio.addEventListener('ended', () => switchSong('forward'));

// Playlist clickability
let playlistSong
playlistOpen.onclick = function(event) {
    if (event.target.classList.contains('playlist__song-info') || event.target.classList.contains('playlist__song-cover') || event.target.classList.contains('playlist_track')) {
        playlistSong = event.target.closest('.playlist__song')
    } else if (event.target.classList.contains('playlist__song')) {
        playlistSong = event.target
    } else {
        return
    }
    playlist.forEach(item => item.classList.remove('selected'))
    playlistSong.classList.toggle('selected');
    const selectedSong = document.querySelector('.selected');
    const selectedSongIndex = playlist.indexOf(selectedSong);
    songs.filter((song) => {
        if (song.id == selectedSongIndex) {
            playSong(song);
        };
    });
}

console.log('Оценка: 60\n\n',
    '1. Вёрстка (10/10)\n',
    '1.1. Вёрстка аудиоплеера: есть кнопка Play/Pause, кнопки "Вперёд" и "Назад" для пролистывания аудиотреков, прогресс-бар, отображается название и автор трека +5\n',
    '1.2. В футере приложения есть ссылка на гитхаб автора приложения, год создания приложения, логотип курса со ссылкой на курс +5\n\n',
    '2. Кнопка Play/Pause на панели управления (10/10)\n',
    '2.1. Есть кнопка Play/Pause, при клике по которой можно запустить или остановить проигрывание аудиотрека +5\n',
    '2.2. Внешний вид и функционал кнопки Play/Pause изменяется в зависимости от того, проигрывается ли в данный момент аудиотрек +5\n\n',
    '3. При кликах по кнопкам "Вперёд" и "Назад" переключается проигрываемый аудиотрек. Аудиотреки пролистываются по кругу - после последнего идёт первый (10/10)\n\n',
    '4. При смене аудиотрека меняется изображение - обложка аудиотрека (10/10)\n\n',
    '5. Прогресс-бар отображает прогресс проигрывания текущего аудиотрека. При перемещении ползунка вручную меняется текущее время проигрывания аудиотрека (10/10)\n\n',
    '6. Отображается продолжительность аудиотрека и его текущее время проигрывания (10/10)\n\n',
    'В планах добавить возможность загрузки треков в плейлист и переключение треков из плейлиста');
