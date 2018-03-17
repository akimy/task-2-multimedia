/**
 * @class SynteticSpeech - класс для создания экземпляра для воспроизведения
 * синтетического голоса c помощью Web Speech API
*/
export default class SynteticSpeech {
  /**
   * @param {string} language - выбранная локаль.
   * @param {EventTarget} SpeechSynthesis - класс из лексического окружения для генерации речи
   * @param {EventTarget} SpeechSynthesisUtterance - класс из лексического окружения для
   * генерации речи
   */
  constructor(language, SpeechSynthesis, SpeechSynthesisUtterance) {
    const msg = new SpeechSynthesisUtterance('');
    msg.lang = language;
    this.msg = msg;
    this.speechSynthesis = SpeechSynthesis;
  }

  /**
   * Устанавливает скорость чтения голоса
   * @param {number} value
   */
  setRate(value) {
    this.msg.rate = value;
  }

  /**
   * Устанавливает высоту голоса
   * @param {number} value
   */
  setPitch(value) {
    this.msg.pitch = value;
  }

  /**
   * Устанавливает сообщение для чтения
   * @param {string} value
   */
  setText(value) {
    this.msg.text = value;
  }

  /**
   * Воспроизводит сообщение
   */
  speak() {
    const { speechSynthesis, msg } = this;
    speechSynthesis.speak(msg);
  }
}
