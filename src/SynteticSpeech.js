export default class SynteticSpeech {
  constructor(language, speechSynthesis) {
    const msg = new window.SpeechSynthesisUtterance('');
    msg.lang = language;
    this.msg = msg;
    this.speechSynthesis = speechSynthesis;
  }

  setRate(value) {
    this.msg.rate = value;
  }

  setPitch(value) {
    this.msg.pitch = value;
  }

  setText(value) {
    this.msg.text = value;
  }

  speak() {
    const { speechSynthesis, msg } = this;
    speechSynthesis.speak(msg);
  }
}
