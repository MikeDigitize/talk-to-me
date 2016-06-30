export default class TalkToMe {

	constructor() {
		this.speech = TalkToMe.support();
		if(!this.speech) {
			//this.onError('Sorry your browser doesn\'t support speech recognition');
		}
		console.log(this.speech);
	}

	onError(msg) {
		throw new Error(msg);
	}

	onNoSupport(cb = () => {}) {
		if(!this.speech) {
			cb();
		}		
	}

	static support() {
		return window.SpeechRecognition ||
			window.webkitSpeechRecognition ||
			window.mozSpeechRecognition ||
			window.msSpeechRecognition ||
			window.oSpeechRecognition || 
			false;
	}

}