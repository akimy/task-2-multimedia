import SynteticSpeech from './classes/SynteticSpeech';
import TerminatorInterface from './classes/TerminatorInterface';
import VideoScene from './classes/VideoScene';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Получаем дом элементы
const videoElement = document.querySelector('.video-instance');
const sceneElement = document.querySelector('.scene');
const interfaceElement = document.querySelector('.interface');
const containerElement = document.querySelector('.container');

// Предустановленная ширина и высота (для повышения производительности на слабых устройствах)
let [width, height] = [770, 650];

// Создаем адаптивность (для устройств < 770 px)
if (window.innerWidth < 770) {
  [width, height] = [window.innerWidth, window.innerHeight];
}

// Создание инстансов классов и запуск приложения
const voice = new SynteticSpeech('en-US', window.speechSynthesis, window.SpeechSynthesisUtterance);
voice.setRate(1);
voice.setPitch(0.4);
voice.setText('Movement');

const videoScene = new VideoScene(
  videoElement,
  audioCtx,
  sceneElement,
  width,
  height,
  voice,
  containerElement,
);
videoScene.load();

const ui = new TerminatorInterface(interfaceElement, width, height);
ui.connectScene(videoScene)
  .then(terminatorInterface => terminatorInterface.animate());
