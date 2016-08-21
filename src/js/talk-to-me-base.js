import { Combine } from './combine';
import { Matcher } from './talk-to-me-matcher';
import { Conversate } from './talk-to-me-conversate';


// default error messages
const defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
const nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
const eventListenerNotFoundError = 'Sorry the listener you\'re trying to remove isn\'t currently active';
const noSpeechDetected = 'Sorry no speech detected!';

// a reference to the bound result handler so it can be removed
let resultCallback;

const defaultNoSupportFunction = () => alert(defaultNoSupportMessage);

const isCompatibleSpeechRecognitionEvent = function(speechEvents, evt) {
	return Object.keys(speechEvents).indexOf(evt) > -1;
}


/*
 *	Fires after each result has finished being analysed
 *	Set the autoRestart property to true so it continues to listen
 *	otherwise you'll have to manually use the start method to begin listening again	
 */

const onEnd = function() {
	if(this.autoRestart && this.isListening) {
		this.start();
	}
};


/*
 *	Cycles through the event listeners stored and adds them to the instance
 *	of the speech recognition constructor used at the heart of Talk To Me
 */

const addEventListeners = function() {

	Object.keys(this.eventListeners).forEach(listener => {
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


/*
 *	The ONLY result event listener added to the speech recognition instance
 *	This is because the event object the native API spits out is heavily modified
 *	and stripped down to just the results and whether it's the last set of results
 *	This stripped down event object is then passed into each registered result callback
 *	which is bound so its context is the current instance of Talk To Me
 */

const onResult = function(event) {

	const isFinalResult = event.results[0].isFinal;
	const results = [].slice.call(event.results[0]);

	this.eventListeners.result.forEach((listener, i) => {
		if(i !== 0 && this.isListening) {
			listener.boundCallback({ isFinalResult, results });
		}
	});

}

export class TalkToMe extends Combine(Matcher) {

	constructor(options = {}) {

		super();

		// get the speech recognition constructor and test for support
		let { speech, support } = TalkToMe.getSpeechRecogniserConstructor();
		this.support = support;

		if(this.support) {

			/*
			 *	Default options (optional)
			 *	Set against the instance of the speech recognition API
			 *	And the instance of Talk To Me
			 */

			let { numOfAlternativeMatches, language, finalResultsOnly } = options;
			finalResultsOnly = typeof finalResultsOnly === 'undefined' ? false : !finalResultsOnly;
			
			this.speech = new speech();		
			this.speech.maxAlternatives = numOfAlternativeMatches || 5;
			this.speech.interimResults = finalResultsOnly;
			this.speech.lang = language || 'en-US';

			this.isListening = false;
			this.autoRestart = false;
			this.getFirstMatchOnly = true;

			// store a reference to the bound result callback
			resultCallback = onResult.bind(this);

			// default event listeners
			this.eventListeners = {
				start : [],
				end : [onEnd.bind(this)],
				audioend : [],
				audiostart : [],
				error : [onError.bind(this)],
				nomatch : [],
				result : [resultCallback],
				soundend : [],
				soundstart : [],
				speechend : [],
				speechstart : []
			}
			
			addEventListeners.call(this);

		}
		else {
			this.throwWarning('Sorry, no speech recognition ability found in this browser.');
		}

	}	

	// modify the on no support handler
	onNoSupport(cb = defaultNoSupportFunction) {
		cb();
	}


	/*
	 *	Try / catch will prevent errors thrown if start is called when the
	 *	speech recognition API has already started to listen.
	 *	Likewise for stop (see below method)
	 */

	start() {
		this.isListening = true;
		try {
			this.speech.start();
		}
		catch(e) {
			this.throwWarning(e);
		}	
	}

	stop() {
		this.isListening = false;
		try {
			this.speech.abort();
		}
		catch(e) {
			this.throwWarning(e);
		}
	}

	/*
	 *	Add event listeners to the instance of the speech recognition API 
	 *	Stores a reference to the callback and the bound callback (binds the instance of Talk To Me to it)
	 *	Note: It will not allow more than one 'result' handler because of the way Talk To Me
	 *	modifies the result event object and passes it into the registered callbacks
	 */

	on(evt, callback) {
		if(isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
			let boundCallback = callback.bind(this.speech);
			if(evt !== 'result') {
				this.speech.addEventListener(evt, boundCallback);
			}				
			this.eventListeners[evt].push({ callback, boundCallback });
		}
		else {
			this.throwWarning(nonCompatibleSpeechRecognitionEventError);
			return false;
		}
	}

	/*
	 *	Removes event listeners from the instance of the speech recognition API 
	 *	Matches the callback, not the bound one as externally there is no reference to it
	 *	Then removes the bound callback counterpart event listener
	 *	Note: if the penultimate result event listener is removed, Talk To Me's result listener
	 *	is also removed, a new instance of Talk To Me is created and the event listeners are re-registered
	 */

	off(evt, callback) {
		if(isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {

			let indexOfCallback = this.eventListeners[evt].reduce((ioc, callbacks, i) => {
				if(callbacks.callback === callback) {
					ioc = i;
				}
				return ioc;
			}, -1);

			if(indexOfCallback > -1) {
				this.speech.removeEventListener(evt, this.eventListeners[evt][indexOfCallback].boundCallback);
				this.eventListeners[evt].splice(indexOfCallback, 1);
			}	
			else {
				this.throwWarning(eventListenerNotFoundError);
			}	

			if(evt === 'result' && this.eventListeners.result.length === 1) {
				
				this.speech.removeEventListener('result', resultCallback);
				let { speech } = TalkToMe.getSpeechRecogniserConstructor();
				this.speech = new speech();
				addEventListeners.call(this);

			}
		}
		else {
			throwWarning(nonCompatibleSpeechRecognitionEventError);
			return false;
		}

	}

	throwWarning(msg) {
		console.warn(msg);	
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