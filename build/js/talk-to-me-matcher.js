(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TalkToMe = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _talkToMe = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var hasFoundMatch = false;

	var findMatches = function findMatches(evt) {
		var _this = this;

		var results = evt.results;
		var isFinalResult = evt.isFinalResult;


		if (!hasFoundMatch) {

			var match = results.reduce(function (matched, result) {
				_this.searchTerms.forEach(function (term, i) {
					var searchFor = Object.keys(_this.searchTerms[i])[0];
					if (searchFor === result.transcript || searchFor === result.transcript + 's') {
						matched.term = searchFor;
						matched.callback = _this.searchTerms[i][searchFor];
					}
				});
				return matched;
			}, { term: '', callback: function callback() {} });

			if (match.term) {
				hasFoundMatch = true;
			}

			match.callback.call(this, match.term);
		}

		if (isFinalResult) {
			if (!hasFoundMatch && this.onNoMatch) {
				this.onNoMatch.call(this, results);
			}
			hasFoundMatch = false;
		}
	};

	var TalkToMe = exports.TalkToMe = function (_TTM) {
		_inherits(TalkToMe, _TTM);

		function TalkToMe(options) {
			_classCallCheck(this, TalkToMe);

			var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TalkToMe).call(this, options));

			_this2.searchTerms = [];
			_this2.on('result', _this2.resultMatcher.bind(_this2));
			return _this2;
		}

		_createClass(TalkToMe, [{
			key: 'match',
			value: function match(matches) {
				if (this.support) {
					var searchTerms = Object.keys(matches);
					var searches = searchTerms.map(function (term) {
						var obj = {};
						obj[term] = matches[term];
						return obj;
					});
					this.searchTerms = this.searchTerms.concat(searches);
				}
			}
		}, {
			key: 'noMatch',
			value: function noMatch(callback) {
				if (this.support) {
					this.onNoMatch = callback;
				}
			}
		}, {
			key: 'resultMatcher',
			value: function resultMatcher(evt) {
				if (this.support && this.searchTerms.length) {
					findMatches.call(this, evt);
				}
			}
		}]);

		return TalkToMe;
	}(_talkToMe.TalkToMe);

	function onMatch(term) {
		console.log('So you\'re interested in ' + term + '?');
	}

	function onNoMatch(results) {
		console.log('Sorry, do you want to try saying that again?', results);
	}

	var ttm = new TalkToMe();
	ttm.autoRestart = true;
	ttm.noMatch(onNoMatch);
	ttm.match({
		'washing machines': onMatch,
		'TVs': onMatch,
		'AO': onMatch
	});
	ttm.start();

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
	var nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
	var eventListenerNotFoundError = 'Sorry the listener you\'re trying to remove isn\'t currently active';
	var noSpeechDetected = 'Sorry no speech detected!';

	var defaultNoSupportFunction = function defaultNoSupportFunction() {
		return alert(defaultNoSupportMessage);
	};

	var isCompatibleSpeechRecognitionEvent = function isCompatibleSpeechRecognitionEvent(speechEvents, evt) {
		return Object.keys(speechEvents).indexOf(evt) > -1;
	};

	var onEnd = function onEnd() {
		if (this.autoRestart && this.isListening) {
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

	var onResult = function onResult(event) {
		var isFinalResult = event.results[0].isFinal;
		var results = [].slice.call(event.results[0]);
		this.eventListeners.result.forEach(function (listener, i) {
			if (i !== 0) {
				listener({ isFinalResult: isFinalResult, results: results });
			}
		});
	};

	var throwWarning = function throwWarning(msg) {
		console.warn(msg);
	};

	var TalkToMe = exports.TalkToMe = function () {
		function TalkToMe() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, TalkToMe);

			var _TalkToMe$getSpeechRe = TalkToMe.getSpeechRecogniserConstructor();

			var speech = _TalkToMe$getSpeechRe.speech;
			var support = _TalkToMe$getSpeechRe.support;

			this.support = support;

			if (this.support) {
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var language = options.language;
				var finalResultsOnly = options.finalResultsOnly;

				finalResultsOnly = typeof finalResultsOnly === 'undefined' ? true : !finalResultsOnly;
				this.speech = new speech();
				this.speech.maxAlternatives = numOfAlternativeMatches || 5;
				this.speech.interimResults = finalResultsOnly;
				this.speech.lang = language || 'en-US';
				this.isListening = false;
				this.autoRestart = false;

				this.eventListeners = {
					start: [],
					end: [onEnd.bind(this)],
					audioend: [],
					audiostart: [],
					error: [onError.bind(this)],
					nomatch: [],
					result: [onResult.bind(this)],
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
				if (this.support) {
					this.isListening = true;
					try {
						this.speech.start();
					} catch (e) {
						throwWarning(e);
					}
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (this.support) {
					this.isListening = false;
					try {
						this.speech.abort();
					} catch (e) {
						throwWarning(e);
					}
				}
			}
		}, {
			key: 'on',
			value: function on(evt, callback) {
				if (this.support) {
					if (isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
						if (evt !== 'result') {
							this.speech.addEventListener(evt, callback.bind(this.speech));
						}
						this.eventListeners[evt].push(callback);
						return true;
					} else {
						throwWarning(nonCompatibleSpeechRecognitionEventError);
						return false;
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
							return true;
						} else {
							throwWarning(eventListenerNotFoundError);
							return false;
						}
					} else {
						throwWarning(nonCompatibleSpeechRecognitionEventError);
						return false;
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

/***/ }
/******/ ])
});
;