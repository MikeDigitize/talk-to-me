/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ttm = __webpack_require__(1);

	var _ttm2 = _interopRequireDefault(_ttm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var numOfAlternativeMatches = 10;
	var finalResultsOnly = true;

	var ttm = new _ttm2.default({
	  numOfAlternativeMatches: numOfAlternativeMatches, finalResultsOnly: finalResultsOnly
	});

	console.log(ttm);

	ttm.onNoSupport();
	ttm.autoRestart = true;
	ttm.on('result', onResult);
	ttm.on('poop', onResult);

	function onResult(evt) {
	  console.log('some results', evt);
	}

	ttm.start();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
	var nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
	var eventListenerNotFoundError = 'Sorry the listener you\'re trying to remove isn\'t currently active';
	var noSpeechDetected = 'Sorry no speech detected!';

	var defaultNoSupportFunction = function defaultNoSupportFunction() {
		return alert(defaultNoSupportMessage);
	};
	var isCompatibleSpeechRecognitionEvent = function isCompatibleSpeechRecognitionEvent(speechEvents, evt) {
		return !!Object.keys(speechEvents).find(function (speechEvent) {
			return speechEvent === evt;
		});
	};

	var onEnd = function onEnd() {
		this.isListening = false;
		if (this.autoRestart) {
			this.start();
		}
	};

	var addDefaultEvents = function addDefaultEvents(listeners, speech) {
		Object.keys(listeners).forEach(function (listener) {
			var handler = listeners[listener][0];
			if (handler) {
				speech.addEventListener(listener, handler);
			}
		});
	};

	var onError = function onError(e) {
		if (e.error === 'no-speech') {
			console.warn(noSpeechDetected);
		} else {
			throwWarning(e.error);
		}
	};

	var throwWarning = function throwWarning(msg) {
		console.warn(msg);
	};

	var TalkToMe = function () {
		function TalkToMe(options) {
			_classCallCheck(this, TalkToMe);

			var _TalkToMe$getSpeechRe = TalkToMe.getSpeechRecogniserConstructor();

			var speech = _TalkToMe$getSpeechRe.speech;
			var support = _TalkToMe$getSpeechRe.support;

			this.support = support;

			if (this.support) {
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var finalResultsOnly = options.finalResultsOnly;
				var language = options.language;
				var continuous = options.continuous;

				this.speech = new speech();
				this.speech.maxAlternatives = numOfAlternativeMatches || 5;
				this.speech.continuous = continuous || true; // not supported in some browsers
				this.speech.interimResults = finalResultsOnly || true; // continuously anlayses results if true
				this.speech.lang = language || 'en-US'; // HTML lang attribute - defaults to English
				this.isListening = false;
				this.autoRestart = false;

				this.eventListeners = {
					start: [],
					end: [onEnd.bind(this)],
					audioend: [],
					audiostart: [],
					error: [onError.bind(this)],
					nomatch: [],
					result: [],
					soundend: [],
					soundstart: [],
					speechend: [],
					speechstart: []
				};

				addDefaultEvents(this.eventListeners, this.speech);
			}
		}

		_createClass(TalkToMe, [{
			key: 'onNoSupport',
			value: function onNoSupport() {
				var cb = arguments.length <= 0 || arguments[0] === undefined ? defaultNoSupportFunction : arguments[0];

				if (!this.support) {
					cb();
				}
			}
		}, {
			key: 'start',
			value: function start() {
				if (this.support && !this.isListening) {
					this.speech.start();
					this.isListening = true;
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (this.support && this.isListening) {
					this.speech.abort();
					this.isListening = false;
				}
			}
		}, {
			key: 'on',
			value: function on(evt, callback) {
				if (this.support) {
					if (isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
						this.speech.addEventListener(evt, callback.bind(this.speech));
						this.eventListeners[evt].push(callback);
					} else {
						throwWarning(nonCompatibleSpeechRecognitionEventError);
					}
				}
			}
		}, {
			key: 'off',
			value: function off(evt, callback) {
				if (this.support) {
					if (isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
						var indexOfCallback = this.eventListeners[evt].indexOf(callback);
						if (indexOfCallback > -1) {
							this.speech.removeEventListener(evt, callback);
							this.eventListeners[evt].splice(indexOfCallback, 1);
						} else {
							throwWarning(eventListenerNotFoundError);
						}
					} else {
						throwWarning(nonCompatibleSpeechRecognitionEventError);
					}
				}
			}
		}], [{
			key: 'getSpeechRecogniserConstructor',
			value: function getSpeechRecogniserConstructor() {
				var speech = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
				return { speech: speech, support: !!speech };
			}
		}]);

		return TalkToMe;
	}();

	exports.default = TalkToMe;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	if (!Array.prototype.find) {
	  Array.prototype.find = function (predicate) {
	    if (this == null) {
	      throw new TypeError('Array.prototype.find called on null or undefined');
	    }
	    if (typeof predicate !== 'function') {
	      throw new TypeError('predicate must be a function');
	    }
	    var list = Object(this);
	    var length = list.length >>> 0;
	    var thisArg = arguments[1];
	    var value;

	    for (var i = 0; i < length; i++) {
	      value = list[i];
	      if (predicate.call(thisArg, value, i, list)) {
	        return value;
	      }
	    }
	    return undefined;
	  };
	}

/***/ }
/******/ ]);