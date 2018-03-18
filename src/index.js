import SynteticSpeech from './classes/SynteticSpeech';
import TerminatorInterface from './classes/TerminatorInterface';
import VideoScene from './classes/VideoScene';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Получаем дом элементы
const videoElement = document.querySelector('.video-instance');
const sceneElement = document.querySelector('.scene');
const interfaceElement = document.querySelector('.interface');
const containerElement = document.querySelector('.container');
const muteButton = document.querySelector('.mute-speech');

// Предустановленная ширина и высота (для повышения производительности на слабых устройствах)
let [width, height] = [770, 650];

// Создаем адаптивность (для устройств < 770 px)
if (window.innerWidth < 770) {
  [width, height] = [window.innerWidth, window.innerHeight];
}

const tts = new window.ya.speechkit.Tts({
  apikey: '6645e72c-462b-462f-923e-eda53f70819a',
  emotion: 'bad',
  speed: 1.2,
  lang: 'ru-RU',
  speaker: 'omazh',
});
// Создание инстансов классов и запуск приложения

const voice = new SynteticSpeech(tts);
voice.setWords([
  'Замечено движение!',
  'Цель в поле зрения',
  'Убить всех людей!',
  'Вижу движение',
  'Зафиксировала изменение обстановки',
  'От меня не укрыться!',
]);

voice.speakWord('Фиксирую месторасположения - офис Yandex!');

const videoScene = new VideoScene(
  videoElement,
  audioCtx,
  sceneElement,
  width,
  height,
  voice,
  containerElement,
  muteButton,
);
videoScene.load();

const ui = new TerminatorInterface(interfaceElement, width, height);
ui.connectScene(videoScene)
  .then(terminatorInterface => terminatorInterface.animate());

muteButton.addEventListener('click', () => {
  videoScene.toggleMuteSpeech();
});
