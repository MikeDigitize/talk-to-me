import { Combine } from './combine';
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

const addDefaultEvents = function() {
	Object.keys(this.eventListeners)
		.forEach(listener => {
			let handler = this.eventListeners[listener][0];
			if(handler) {
				this.speech.addEventListener(listener, handler);
			}			
		});
}

const onError = function(e) {
	if(this.isListening) {
		if(e.error === 'no-speech') {
			console.warn(noSpeechDetected);
		}
		else {
			this.throwWarning(e.error);
		}	
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

export class TalkToMe {

	constructor(options = {}) {

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
			this.getFirstMatchOnly = true;

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
			
			addDefaultEvents.call(this);

		}
		else {
			this.throwWarning('Sorry, no speech recognition ability found in this browser.')
		}

	}	

	onNoSupport(cb = defaultNoSupportFunction) {
		if(!this.support) {
			cb();
			return true;
		}		
		return false;
	}

	start() {
		if(this.support) {
			this.isListening = true;
			try {
				this.speech.start();
			}
			catch(e) {
				this.throwWarning(e);
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
				this.throwWarning(e);
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
			}
			else {
				this.throwWarning(nonCompatibleSpeechRecognitionEventError);
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
				}	
				else {
					this.throwWarning(eventListenerNotFoundError);
				}			
			}
			else {
				throwWarning(nonCompatibleSpeechRecognitionEventError);
				return false;
			}
			if(this.eventListeners.result.length === 1) {
				this.isListening = false;
			}
			return true;
		}
	}

	throwWarning(msg) {
		console.warn(msg);	
		return true;
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