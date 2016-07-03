import './polyfills';

const addDefaultEvents = function(listeners) {
	Object.keys(listeners).forEach(listener => this.addEventListener(listener, listeners[listener][0]));
}

const defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
const defaultEventErrorMessage = 'Sorry the speech recognition API does not support this event';
const defaultNoSupportFunction = () => alert(defaultNoSupportMessage);

const onStart = () => console.log('started!');
const onEnd = () => console.log('end!');
const onAudioEnd = () => console.log('audioend!');
const onAudioStart = () => console.log('audiostart!');
const onError = () => console.log('error!');
const onNoMatch = () => console.log('nomatch!');
const onResult = () => console.log('result!');
const onSoundEnd = () => console.log('soundend!');
const onSoundStart = () => console.log('soundstart!');
const onSpeechEnd = () => console.log('speechend!');
const onSpeechStart = () => console.log('speechstart!');

const throwError = function(msg){
	throw new Error(msg);
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
			this.stopListening = false;

			this.eventListeners = {
				start : [onStart.bind(this.speech)],
				end : [onEnd.bind(this.speech)],
				audioend : [onAudioEnd.bind(this.speech)],
				audiostart : [onAudioEnd.bind(this.speech)],
				error : [onError.bind(this.speech)],
				nomatch : [onNoMatch.bind(this.speech)],
				result : [onResult.bind(this.speech)],
				soundend : [onSoundEnd.bind(this.speech)],
				soundstart : [onSoundStart.bind(this.speech)],
				speechend : [onSpeechEnd.bind(this.speech)],
				speechstart : [onSpeechStart.bind(this.speech)]
			}
			
			addDefaultEvents.call(this.speech, this.eventListeners);

		}

	}

	onNoSupport(cb = defaultNoSupportFunction) {
		if(!this.support) {
			cb();
		}		
	}

	start() {
		if(this.support && !this.stopListening) {
			this.speech.start();
		}
	}

	on(evt, callback) {
		if(this.support) {
			let isValidEvent = !!Object.keys(this.eventListeners).find(speechEvents => speechEvents === evt);
			console.log(isValidEvent);
			if(isValidEvent) {
				this.speech.addEventListener(evt, callback.bind(this.speech));
				this.eventListeners[evt].push(callback);
			}
			else {
				throwError(defaultEventErrorMessage);
			}
		}
	}

	off(evt, callback) {
		if(this.support) {
			let isValidEvent = !!Object.keys(this.eventListeners).find(speechEvents => speechEvents === evt);
			if(isValidEvent) {
				this.speech.removeEventListener(evt, callback);
				this.eventListeners[evt].splice(this.eventListeners[evt].indexOf(callback), 1);
			}
		}
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