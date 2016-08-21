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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";
/******/
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
	
	// default error messages
	var defaultNoSupportMessage = 'Sorry your browser doesn\'t support speech recognition';
	var nonCompatibleSpeechRecognitionEventError = 'Sorry the speech recognition API does not support this event';
	var eventListenerNotFoundError = 'Sorry the listener you\'re trying to remove isn\'t currently active';
	var noSpeechDetected = 'Sorry no speech detected!';
	
	// a reference to the bound result handler so it can be removed
	var resultCallback = void 0;
	
	var defaultNoSupportFunction = function defaultNoSupportFunction() {
		return alert(defaultNoSupportMessage);
	};
	
	var isCompatibleSpeechRecognitionEvent = function isCompatibleSpeechRecognitionEvent(speechEvents, evt) {
		return Object.keys(speechEvents).indexOf(evt) > -1;
	};
	
	/*
	 *	Fires after each result has finished being analysed
	 *	Set the autoRestart property to true so it continues to listen
	 *	otherwise you'll have to manually use the start method to begin listening again	
	 */
	
	var onEnd = function onEnd() {
		if (this.autoRestart && this.isListening) {
			this.start();
		}
	};
	
	/*
	 *	Cycles through the event listeners stored and adds them to the instance
	 *	of the speech recognition constructor used at the heart of Talk To Me
	 */
	
	var addEventListeners = function addEventListeners() {
		var _this = this;
	
		Object.keys(this.eventListeners).forEach(function (listener) {
			var handler = _this.eventListeners[listener][0];
			if (handler) {
				_this.speech.addEventListener(listener, handler);
			}
		});
	};
	
	var onError = function onError(e) {
		if (this.isListening) {
			if (e.error === 'no-speech') {
				console.warn(noSpeechDetected);
			} else {
				this.throwWarning(e.error);
			}
		}
	};
	
	/*
	 *	The ONLY result event listener added to the speech recognition instance
	 *	This is because the event object the native API spits out is heavily modified
	 *	and stripped down to just the results and whether it's the last set of results
	 *	This stripped down event object is then passed into each registered result callback
	 *	which is bound so its context is the current instance of Talk To Me
	 */
	
	var onResult = function onResult(event) {
		var _this2 = this;
	
		var isFinalResult = event.results[0].isFinal;
		var results = [].slice.call(event.results[0]);
	
		this.eventListeners.result.forEach(function (listener, i) {
			if (i !== 0 && _this2.isListening) {
				listener.boundCallback({ isFinalResult: isFinalResult, results: results });
			}
		});
	};
	
	var TalkToMe = exports.TalkToMe = function (_Combine) {
		_inherits(TalkToMe, _Combine);
	
		function TalkToMe() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			_classCallCheck(this, TalkToMe);
	
			// get the speech recognition constructor and test for support
	
			var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(TalkToMe).call(this));
	
			var _TalkToMe$getSpeechRe = TalkToMe.getSpeechRecogniserConstructor();
	
			var speech = _TalkToMe$getSpeechRe.speech;
			var support = _TalkToMe$getSpeechRe.support;
	
			_this3.support = support;
	
			if (_this3.support) {
	
				/*
	    *	Default options (optional)
	    *	Set against the instance of the speech recognition API
	    *	And the instance of Talk To Me
	    */
	
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var language = options.language;
				var finalResultsOnly = options.finalResultsOnly;
	
				finalResultsOnly = typeof finalResultsOnly === 'undefined' ? false : !finalResultsOnly;
	
				_this3.speech = new speech();
				_this3.speech.maxAlternatives = numOfAlternativeMatches || 5;
				_this3.speech.interimResults = finalResultsOnly;
				_this3.speech.lang = language || 'en-US';
	
				_this3.isListening = false;
				_this3.autoRestart = false;
				_this3.getFirstMatchOnly = true;
	
				// store a reference to the bound result callback
				resultCallback = onResult.bind(_this3);
	
				// default event listeners
				_this3.eventListeners = {
					start: [],
					end: [onEnd.bind(_this3)],
					audioend: [],
					audiostart: [],
					error: [onError.bind(_this3)],
					nomatch: [],
					result: [resultCallback],
					soundend: [],
					soundstart: [],
					speechend: [],
					speechstart: []
				};
	
				addEventListeners.call(_this3);
			} else {
				_this3.throwWarning('Sorry, no speech recognition ability found in this browser.');
			}
	
			return _this3;
		}
	
		// modify the on no support handler
	
	
		_createClass(TalkToMe, [{
			key: 'onNoSupport',
			value: function onNoSupport() {
				var cb = arguments.length <= 0 || arguments[0] === undefined ? defaultNoSupportFunction : arguments[0];
	
				cb();
			}
	
			/*
	   *	Try / catch will prevent errors thrown if start is called when the
	   *	speech recognition API has already started to listen.
	   *	Likewise for stop (see below method)
	   */
	
		}, {
			key: 'start',
			value: function start() {
				this.isListening = true;
				try {
					this.speech.start();
				} catch (e) {
					this.throwWarning(e);
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				this.isListening = false;
				try {
					this.speech.abort();
				} catch (e) {
					this.throwWarning(e);
				}
			}
	
			/*
	   *	Add event listeners to the instance of the speech recognition API 
	   *	Stores a reference to the callback and the bound callback (binds the instance of Talk To Me to it)
	   *	Note: It will not allow more than one 'result' handler because of the way Talk To Me
	   *	modifies the result event object and passes it into the registered callbacks
	   */
	
		}, {
			key: 'on',
			value: function on(evt, callback) {
				if (isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
					var boundCallback = callback.bind(this.speech);
					if (evt !== 'result') {
						this.speech.addEventListener(evt, boundCallback);
					}
					this.eventListeners[evt].push({ callback: callback, boundCallback: boundCallback });
				} else {
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
	
		}, {
			key: 'off',
			value: function off(evt, callback) {
				if (isCompatibleSpeechRecognitionEvent(this.eventListeners, evt)) {
	
					var indexOfCallback = this.eventListeners[evt].reduce(function (ioc, callbacks, i) {
						if (callbacks.callback === callback) {
							ioc = i;
						}
						return ioc;
					}, -1);
	
					if (indexOfCallback > -1) {
						this.speech.removeEventListener(evt, this.eventListeners[evt][indexOfCallback].boundCallback);
						this.eventListeners[evt].splice(indexOfCallback, 1);
					} else {
						this.throwWarning(eventListenerNotFoundError);
					}
	
					if (evt === 'result' && this.eventListeners.result.length === 1) {
	
						this.speech.removeEventListener('result', resultCallback);
	
						var _TalkToMe$getSpeechRe2 = TalkToMe.getSpeechRecogniserConstructor();
	
						var speech = _TalkToMe$getSpeechRe2.speech;
	
						this.speech = new speech();
						addEventListeners.call(this);
					}
				} else {
					throwWarning(nonCompatibleSpeechRecognitionEventError);
					return false;
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
	}((0, _combine.Combine)(_talkToMeMatcher.Matcher));

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
	var createSearches = void 0;
	var onResultCallback = void 0;
	
	var resultMatcher = function resultMatcher(evt) {
		var isFinalResult = evt.isFinalResult;
	
	
		if (!hasFoundMatch || !this.getFirstMatchOnly) {
			findMatches.call(this, evt);
		} else if (hasFoundMatch) {
			resetFindMatches.call(this);
		}
	};
	
	var resetFindMatches = function resetFindMatches() {
	
		this.off('result', onResultCallback);
		this.searchForThese = emptyResults.call(this);
		hasFoundMatch = false;
		this.on('result', onResultCallback);
	};
	
	var createSearchObject = function createSearchObject(searches, search) {
	
		var regex = search.lastIndexOf('s') === search.length - 1 ? search + '?' : search;
		regex = new RegExp('' + regex, 'i');
	
		return {
			term: search,
			results: [],
			callback: searches[search],
			callbackUsed: false,
			regex: regex
		};
	};
	
	var addToSearch = function addToSearch() {
	
		var records = {};
		return function (searches) {
			Object.keys(searches).forEach(function (search) {
				if (!records[search]) {
					records[search] = createSearchObject(searches, search);
				}
			});
			return records;
		};
	};
	
	var findMatches = function findMatches(evt) {
		var results = evt.results;
		var isFinalResult = evt.isFinalResult;
	
	
		if (!hasFoundMatch) {
			findMatch.call(this, evt);
		} else if (!this.getFirstMatchOnly) {
			findMatch.call(this, evt);
		}
	
		if (isFinalResult) {
			if (hasFoundMatch) {
				resetFindMatches.call(this);
			} else {
				this.noMatchFound();
			}
		}
	};
	
	var findMatch = function findMatch(evt) {
	
		this.searchForThese = Object.assign({}, searchText.call(this, evt));
		fireResults.call(this, evt.isFinalResult);
	};
	
	var searchText = function searchText(evt) {
	
		return Object.keys(this.searchForThese).reduce(function (results, key) {
	
			var match = evt.results.filter(function (result) {
				return result.transcript.match(results[key].regex);
			});
	
			if (match.length) {
				results[key].results = results[key].results.concat(match[0]);
				hasFoundMatch = true;
			}
	
			return results;
		}, this.searchForThese);
	};
	
	var fireResults = function fireResults(isFinalResult) {
		var _this = this;
	
		Object.keys(this.searchForThese).forEach(function (key) {
			var _searchForThese$key = _this.searchForThese[key];
			var results = _searchForThese$key.results;
			var callbackUsed = _searchForThese$key.callbackUsed;
	
	
			if (results.length && !callbackUsed) {
				var _searchForThese$key2 = _this.searchForThese[key];
				var term = _searchForThese$key2.term;
				var _results = _searchForThese$key2.results;
	
	
				_this.searchForThese[key].callbackUsed = true;
				_this.searchForThese[key].callback.call(_this, {
					term: term,
					results: _results,
					isFinalResult: isFinalResult
				});
			}
		});
	};
	
	var emptyResults = function emptyResults() {
		var _this2 = this;
	
		return Object.keys(this.searchForThese).reduce(function (searchForThese, key) {
	
			searchForThese[key] = Object.assign({}, _this2.searchForThese[key], {
				results: [],
				callbackUsed: false
			});
	
			return searchForThese;
		}, {});
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
				var searches = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
				if ((typeof searches === 'undefined' ? 'undefined' : _typeof(searches)) !== 'object' || !Object.keys(searches).length) {
					this.throwWarning('match expects an object with a key term and a callback value.');
					return;
				}
	
				if (!this.searchForThese) {
					createSearches = addToSearch();
					onResultCallback = resultMatcher.bind(this);
					this.on('result', onResultCallback);
				}
	
				this.searchForThese = createSearches(searches);
	
				if (!this.noMatchFound) {
					this.onNoMatch();
				}
			}
		}, {
			key: 'onNoMatch',
			value: function onNoMatch() {
				var callback = arguments.length <= 0 || arguments[0] === undefined ? noMatch : arguments[0];
	
				this.noMatchFound = callback.bind(this);
			}
		}, {
			key: 'removeMatchTerm',
			value: function removeMatchTerm(term) {
				delete this.searchForThese[term];
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

	// const createSearch = function() {
	// 	return new RegExp(this.searchFor.reduce((text, term, i) => {
	// 		if(i > 0) {
	// 			text += '|';
	// 		}
	// 		text += `${Object.keys(term)[0]}s?`;
	// 		return text;
	// 	}, ''), 'i');
	// }

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
//# sourceMappingURL=talk-to-me.js.map