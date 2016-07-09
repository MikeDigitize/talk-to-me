const defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
const nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
const eventListenerNotFoundError = 'Sorry the listener you\'re trying to remove isn\'t currently active';
const noSpeechDetected = 'Sorry no speech detected!';

const defaultNoSupportFunction = () => alert(defaultNoSupportMessage);

const isCompatibleSpeechRecognitionEvent = function(speechEvents, evt) {
	return Object.keys(speechEvents).indexOf(evt) > -1;
}

const onEnd = function() {
	if(this.autoRestart && this.isListening) {
		this.start();
	}
};

const addDefaultEvents = function(listeners, speech) {
	Object.keys(listeners)
		.forEach(listener => {
			let handler = listeners[listener][0];
			if(handler) {
				speech.addEventListener(listener, handler);
			}			
		});
}

const onError = function(e) {
	if(e.error === 'no-speech') {
		console.warn(noSpeechDetected);
	}
	else {
		throwWarning(e.error);
	}
}

const throwWarning = function(msg) {
	console.warn(msg);	
}

export class TalkToMe {

	constructor(options = {}) {

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
			this.autoRestart = false;

			this.eventListeners = {
				start : [],
				end : [onEnd.bind(this)],
				audioend : [],
				audiostart : [],
				error : [onError.bind(this)],
				nomatch : [],
				result : [],
				soundend : [],
				soundstart : [],
				speechend : [],
				speechstart : []
			}
			
			addDefaultEvents(this.eventListeners, this.speech);

		}

	}	

	onNoSupport(cb = defaultNoSupportFunction) {
		if(!this.support) {
			cb();
		}		
	}

	start() {
		if(this.support) {
			this.isListening = true;
			try {
				this.speech.start();
			}
			catch(e) {
				throwWarning(e);
			}			
		}
	}

	stop() {
		if(this.support) {
			this.isListening = false;
			try {
				this.speech.abort();
			}
			catch(e) {
				throwWarning(e);
			}
		}
	}

	on(evt, callback) {
		if(this.support) {
			if(isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
				this.speech.addEventListener(evt, callback.bind(this.speech));
				this.eventListeners[evt].push(callback);
			}
			else {
				throwWarning(nonCompatibleSpeechRecognitionEventError);
			}
		}
	}

	off(evt, callback) {
		if(this.support) {
			if(isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
				let indexOfCallback = this.eventListeners[evt].indexOf(callback);				
				if(indexOfCallback > -1) {
					this.speech.removeEventListener(evt, callback);
					this.eventListeners[evt].splice(indexOfCallback, 1);
				}	
				else {
					throwWarning(eventListenerNotFoundError)
				}			
			}
			else {
				throwWarning(nonCompatibleSpeechRecognitionEventError);
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