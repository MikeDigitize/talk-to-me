import { combine } from './combine';
import { Matcher } from './talk-to-me-matcher';
import { Conversate } from './talk-to-me-conversate';

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

export const onError = function(e) {
	if(e.error === 'no-speech') {
		console.warn(noSpeechDetected);
	}
	else {
		throwWarning(e.error);
	}
}

const onResult = function(event) {
	const isFinalResult = event.results[0].isFinal;
	const results = [].slice.call(event.results[0]);
	this.eventListeners.result.forEach((listener, i) => {
		if(i !== 0) {
			listener({ isFinalResult, results });
		}
	});
}

export const throwWarning = function(msg) {
	console.warn(msg);	
}

export class TalkToMe extends combine(Matcher, Conversate) {

	constructor(options = {}) {

		super();

		let { speech, support } = TalkToMe.getSpeechRecogniserConstructor();
		this.support = support;

		if(this.support) {

			let { numOfAlternativeMatches, language, finalResultsOnly } = options;
			finalResultsOnly = typeof finalResultsOnly === 'undefined' ? true : !finalResultsOnly;
			this.speech = new speech();		
			this.speech.maxAlternatives = numOfAlternativeMatches || 5;
			this.speech.interimResults = finalResultsOnly;
			this.speech.lang = language || 'en-US';
			this.isListening = false;
			this.autoRestart = false;

			this.eventListeners = {
				start : [],
				end : [onEnd.bind(this)],
				audioend : [],
				audiostart : [],
				error : [onError.bind(this)],
				nomatch : [],
				result : [onResult.bind(this)],
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
				if(evt !== 'result') {
					this.speech.addEventListener(evt, callback.bind(this.speech));
				}				
				this.eventListeners[evt].push(callback);
				return true;
			}
			else {
				throwWarning(nonCompatibleSpeechRecognitionEventError);
				return false;
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
					return true;
				}	
				else {
					throwWarning(eventListenerNotFoundError);
					return false;
				}			
			}
			else {
				throwWarning(nonCompatibleSpeechRecognitionEventError);
				return false;
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