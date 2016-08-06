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

	var _combine = __webpack_require__(1);

	var _talkToMeMatcher = __webpack_require__(2);

	var _talkToMeConversate = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
			this.throwWarning(e.error);
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

	var TalkToMe = exports.TalkToMe = function (_Combine) {
		_inherits(TalkToMe, _Combine);

		function TalkToMe() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, TalkToMe);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TalkToMe).call(this));

			var _TalkToMe$getSpeechRe = TalkToMe.getSpeechRecogniserConstructor();

			var speech = _TalkToMe$getSpeechRe.speech;
			var support = _TalkToMe$getSpeechRe.support;

			_this.support = support;

			if (_this.support) {
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var language = options.language;
				var finalResultsOnly = options.finalResultsOnly;

				finalResultsOnly = typeof finalResultsOnly === 'undefined' ? true : !finalResultsOnly;
				_this.speech = new speech();
				_this.speech.maxAlternatives = numOfAlternativeMatches || 5;
				_this.speech.interimResults = finalResultsOnly;
				_this.speech.lang = language || 'en-US';
				_this.isListening = false;
				_this.autoRestart = false;
				_this.getFirstMatchOnly = true;

				_this.eventListeners = {
					start: [],
					end: [onEnd.bind(_this)],
					audioend: [],
					audiostart: [],
					error: [onError.bind(_this)],
					nomatch: [],
					result: [onResult.bind(_this)],
					soundend: [],
					soundstart: [],
					speechend: [],
					speechstart: []
				};

				addDefaultEvents(_this.eventListeners, _this.speech);
			}

			return _this;
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
						this.throwWarning(e);
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
						this.throwWarning(e);
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
						this.throwWarning(nonCompatibleSpeechRecognitionEventError);
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
							this.throwWarning(eventListenerNotFoundError);
							return false;
						}
					} else {
						throwWarning(nonCompatibleSpeechRecognitionEventError);
						return false;
					}
				}
			}
		}, {
			key: 'throwWarning',
			value: function throwWarning(msg) {
				console.warn(msg);
			}
		}], [{
			key: 'getSpeechRecogniserConstructor',
			value: function getSpeechRecogniserConstructor() {
				var speech = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
				return { speech: speech, support: !!speech };
			}
		}]);

		return TalkToMe;
	}((0, _combine.Combine)(_talkToMeMatcher.Matcher, _talkToMeConversate.Conversate));

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Combine = Combine;
	function Combine() {
		var combined = function combined() {};

		for (var _len = arguments.length, constructors = Array(_len), _key = 0; _key < _len; _key++) {
			constructors[_key] = arguments[_key];
		}

		combined.prototype = constructors.reduce(function (proto, constructor) {
			Object.getOwnPropertyNames(constructor.prototype).forEach(function (key) {
				if (key !== 'constructor') {
					proto[key] = constructor.prototype[key];
				}
			});
			return proto;
		}, {});
		return combined;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var hasFoundMatch = false;
	var matchedTerms = [];

	var searchText = function searchText(searchResults) {
		var _this = this;

		return searchResults.reduce(function (matches, result) {

			_this.searchTerms.forEach(function (term, i) {

				var searchFor = Object.keys(_this.searchTerms[i])[0];
				var regex = new RegExp(searchFor + 's?', 'ig');
				var transcript = result.transcript;
				var found = transcript.match(regex);

				if (found) {

					var alreadyFound = matches.reduce(function (found, match) {
						if (Object.keys(match)[0] === searchFor) {
							found = true;
						}
						return found;
					}, false);

					if (!alreadyFound) {
						matches.push(_this.searchTerms[i]);
					}
				}
			});

			return matches;
		}, []);
	};

	var findMatches = function findMatches(evt) {
		var results = evt.results;
		var isFinalResult = evt.isFinalResult;


		if (!hasFoundMatch) {
			findMatch.call(this, evt);
		}

		if (hasFoundMatch && !this.getFirstMatchOnly) {
			findMatch.call(this, evt);
		}
	};

	var findMatch = function findMatch(evt) {
		var results = evt.results;
		var isFinalResult = evt.isFinalResult;

		var noOfTermsToSearchFor = this.searchTerms.length;
		var matches = searchText.call(this, results);

		console.log(matches);

		// if(match.term) {
		// 	hasFoundMatch = true;
		// 	if(this.getFirstMatchOnly) {
		// 		this.searchTerms = [];
		// 		match.callback.call(this, match.term, evt);
		// 	}
		// 	else {
		// 		if(matchedTerms.indexOf(match.term) === -1) {
		// 			matchedTerms.push(match.term);
		// 		}			
		// 	}

		// }	

		// if(isFinalResult) {
		// 	if(!hasFoundMatch) {
		// 		this.noMatchFound.call(this, results);
		// 	}
		// 	else if(!this.getFirstMatchOnly) {
		// 		match.callback.call(this, matchedTerms, evt);
		// 	}
		// 	hasFoundMatch = false;
		// }
	};

	var resultMatcher = function resultMatcher(evt) {
		if (this.support && this.searchTerms.length) {
			findMatches.call(this, evt);
		}
	};

	var noMatch = function noMatch() {
		this.throwWarning('Sorry no matches found, try again?');
	};

	var Matcher = exports.Matcher = function () {
		function Matcher() {
			_classCallCheck(this, Matcher);
		}

		_createClass(Matcher, [{
			key: 'match',
			value: function match() {
				var matches = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				if (this.support) {

					if ((typeof matches === 'undefined' ? 'undefined' : _typeof(matches)) !== 'object' || !Object.keys(matches).length) {
						this.throwWarning('match expects an object with a key term and a callback value.');
						return;
					}

					var searchTerms = Object.keys(matches);
					var searches = searchTerms.map(function (term) {
						var obj = {};
						obj[term] = matches[term];
						return obj;
					});

					if (!this.searchTerms) {
						this.searchTerms = [];
						this.on('result', resultMatcher.bind(this));
					}

					this.searchTerms = this.searchTerms.concat(searches);
					this.onNoMatch();
				}
			}
		}, {
			key: 'onNoMatch',
			value: function onNoMatch() {
				var callback = arguments.length <= 0 || arguments[0] === undefined ? noMatch : arguments[0];

				if (this.support) {
					this.noMatchFound = callback.bind(this);
				}
			}
		}, {
			key: 'removeMatchTerm',
			value: function removeMatchTerm(term) {
				this.searchTerms = this.searchTerms.filter(function (searchItem) {
					return Object.keys(searchItem) !== term;
				});
			}
		}]);

		return Matcher;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var conversation = [];

	var Conversate = exports.Conversate = function () {
		function Conversate() {
			_classCallCheck(this, Conversate);
		}

		_createClass(Conversate, [{
			key: "conversate",
			value: function conversate(matches) {
				// this.getFirstMatchOnly = false;
				this.match(matches);
			}
		}]);

		return Conversate;
	}();

	/*

	top level object

	{
		depth : 1 // the amount of questions
		questions : [{
			question : 'What would you like to shop for?',
			answers : {
				name : ['washing machine', 'TVs']
				verbs : [
					{
						pronoun : 'you',
						verb : 'show'
					}, 
					{
						pronoun : 'you',
						verb : ['info', 'information']
					}
				],
				onMatch : function(evt) {
					console.log('Do you want us to ${verb} ${pronoun} ${results} or ')	
				}
			}
		}]
	}




	*/

/***/ }
/******/ ])
});
;