import './polyfills';

const defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
const nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
const defaultNoSupportFunction = () => alert(defaultNoSupportMessage);

const onStart = function() { console.log('started!') };
const onEnd = function() {
	if(this.autoRestart) {
		this.start();
	}
};
const onAudioEnd = () => console.log('audioend!');
const onAudioStart = () => console.log('audiostart!');
const onError = () => console.log('error!');
const onNoMatch = () => console.log('nomatch!');
const onResult = () => console.log('result!');
const onSoundEnd = () => console.log('soundend!');
const onSoundStart = () => console.log('soundstart!');
const onSpeechEnd = () => console.log('speechend!');
const onSpeechStart = () => console.log('speechstart!');

const throwError = function(msg) {
	console.error(msg);	
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
			this.autoRestart = true;

			this.eventListeners = {
				start : [onStart.bind(this)],
				end : [onEnd.bind(this)],
				audioend : [onAudioEnd.bind(this)],
				audiostart : [onAudioEnd.bind(this)],
				error : [onError.bind(this)],
				nomatch : [onNoMatch.bind(this)],
				result : [onResult.bind(this)],
				soundend : [onSoundEnd.bind(this)],
				soundstart : [onSoundStart.bind(this)],
				speechend : [onSpeechEnd.bind(this)],
				speechstart : [onSpeechStart.bind(this)]
			}
			
			this.addDefaultEvents();

		}

	}

	addDefaultEvents() {
		Object.keys(this.eventListeners)
			.forEach(listener => this.speech.addEventListener(listener, this.eventListeners[listener][0]));
	}

	onNoSupport(cb = defaultNoSupportFunction) {
		if(!this.support) {
			cb();
		}		
	}

	start() {
		if(this.support && !this.isListening && this.autoRestart) {
			this.speech.start();
			this.isListening = true;
		}
	}

	stop() {
		if(this.support && this.isListening) {
			this.speech.abort();
			this.isListening = false;
		}
	}

	on(evt, callback) {
		if(this.support) {
			let isValidEvent = !!Object.keys(this.eventListeners).find(speechEvents => speechEvents === evt);
			if(isValidEvent) {
				this.speech.addEventListener(evt, callback.bind(this.speech));
				this.eventListeners[evt].push(callback);
			}
			else {
				throwError(nonCompatibleSpeechRecognitionEventError);
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