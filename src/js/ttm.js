const addEvents = function(listeners) {
	Object.keys(listeners).forEach(listener => this.addEventListener(listener, listeners[listener][0]));
}

const eventListeners = {
	start : [() => console.log('started!')],
	end : [() => console.log('end!')],
	audioend : [() => console.log('audioend!')],
	audiostart : [() => console.log('audiostart!')],
	error : [() => console.log('error!')],
	nomatch : [() => console.log('nomatch!')],
	result : [() => console.log('result!')],
	soundend : [() => console.log('soundend!')],
	soundstart : [() => console.log('soundstart!')],
	speechend : [() => console.log('speechend!')],
	speechstart : [() => console.log('speechstart!')]
}

export default class TalkToMe {

	constructor(options) {

		let { speech, support } = TalkToMe.getSpeechRecogniserConstructor();
		this.support = support;

		if(this.support) {

			let { numOfAlternativeMatches, finalResultsOnly, language, continuous } = options;
			this.speech = new speech();		
			this.speech.maxAlternatives = numOfAlternativeMatches || 5;
			this.speech.continuous = continuous || true;	// not supported in some browsers
			this.speech.interimResults = finalResultsOnly || true;	// continuously anlayses results if true
			this.speech.lang = language || 'en-US';	// HTML lang attribute - defaults to English
			this.isListening = false;
			this.stopListening = false;
			
			addEvents.call(this.speech, eventListeners);

		}

	}

	onNoSupport(cb = () => {}) {
		if(!this.support) {
			cb();
		}		
	}

	start() {
		if(this.support && !this.isListening && !this.stopListening) {
			this.speech.start();
			this.isListening = true;
		}
	}

	on(evt, callback) {
		//this.callbacks.push({ evt, callback})
	}

	static getSpeechRecogniserConstructor() {
		let speech = window.SpeechRecognition ||
			window.webkitSpeechRecognition ||
			window.mozSpeechRecognition ||
			window.msSpeechRecognition ||
			window.oSpeechRecognition;
		return { speech, support : !!speech }
	}

}