/**
 * @class SynteticSpeech - класс для создания экземпляра для воспроизведения
 * синтетического голоса c помощью Yandex speechKit
*/

export default class SynteticSpeech {
  /**
   * @param {string} language - выбранная локаль.
   * @param {EventTarget} SpeechSynthesis - класс из лексического окружения для генерации речи
   * @param {EventTarget} SpeechSynthesisUtterance - класс из лексического окружения для
   * генерации речи
   */
  constructor(ttsInstance) {
    this.tts = ttsInstance;
  }

  /**
   * Устанавливает массив случайных фраз
   * @param {Array} arr - массив слов
   */
  setWords(arr) {
    this.words = arr;
  }

  /**
   * Возвращает случайное слово из списка
   */
  getRandomWord() {
    return this.words[Math.floor(Math.random() * this.words.length - 1)];
  }

  /**
   * Воспроизводит сообщение
   */
  speak() {
    this.tts.speak(this.getRandomWord());
  }

  /**
   * Воспроизводит конкретное сообщение
   * @param {string} word
   */
  speakWord(word) {
    this.tts.speak(word);
  }
}
