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
	exports.TalkToMe = TalkToMe;
	
	var _combine = __webpack_require__(1);
	
	var _talkToMeMatcher = __webpack_require__(2);
	
	var _talkToMeConversate = __webpack_require__(3);
	
	var _talkToMeBase = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Talk = function (_Combine) {
		_inherits(Talk, _Combine);
	
		function Talk(options) {
			_classCallCheck(this, Talk);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(Talk).call(this, options));
		}
	
		return Talk;
	}((0, _combine.Combine)(_talkToMeBase.TalkToMeBase, [_talkToMeMatcher.Matcher, _talkToMeConversate.Conversate]));
	
	function TalkToMe(options) {
		return new Talk(options);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Combine = Combine;
	function Combine(target) {
		var fns = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	
	
		// copy super class prototype
		var protoCopy = Object.assign(target.prototype);
	
		// copy additional, non-present properties onto super class prototype
		var extendedProto = (Array.isArray(fns) ? fns : [fns]).reduce(function (proto, fn) {
			Object.getOwnPropertyNames(fn.prototype).forEach(function (prop) {
				if (!protoCopy.hasOwnProperty(prop)) {
					proto[prop] = fn.prototype[prop];
				}
			});
			return proto;
		}, protoCopy);
	
		// assign extended prototype to superclass
		target.prototype = Object.assign(extendedProto);
		return target;
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
	
	// the initial result handler
	var resultMatcher = function resultMatcher(evt) {
		var isFinalResult = evt.isFinalResult;
	
	
		if (!hasFoundMatch || !this.getFirstMatchOnly) {
			findMatches.call(this, evt);
		} else if (hasFoundMatch) {
			resetFindMatches.call(this);
		}
	};
	
	// will remove the callback and re-initialise the searches
	var resetFindMatches = function resetFindMatches() {
	
		this.off('result', onResultCallback);
		this.searchForThese = emptyResults.call(this);
		hasFoundMatch = false;
		this.on('result', onResultCallback);
	};
	
	// returns a function that adds new search terms
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
	
	// new search terms are stored as objects
	var createSearchObject = function createSearchObject(searches, search) {
	
		var regex = search.lastIndexOf('s') === search.length - 1 ? search : search + 's?';
		regex = new RegExp('' + regex, 'i');
	
		return {
			term: search,
			results: [],
			callback: searches[search],
			callbackUsed: false,
			regex: regex
		};
	};
	
	// handles finding matches and when the last result fires and no matches are found
	var findMatches = function findMatches(evt) {
		var results = evt.results;
		var isFinalResult = evt.isFinalResult;
	
	
		if (!hasFoundMatch || !this.getFirstMatchOnly) {
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
	
	// searches for matches against each stored search item and updates the search objects
	var findMatch = function findMatch(evt) {
	
		this.searchForThese = Object.assign({}, searchText.call(this, evt));
		fireResults.call(this, evt.isFinalResult);
	};
	
	// searches for matches and updates search objects if found
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
	
	// fires results when a new match has been made
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
	
	// refreshes the search objects upon completion
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
		return this.throwWarning('Sorry no matches found, try again?');
	};
	
	/*
		Expects an object of key (search term) and value (callback)
	
		Creates an object property on the instance called searchForThese to store the above
	
		Each time `match` is called it adds to the existing search terms
	
		All results are captured in a single handler
	
		If a match is yet to be found and events are being produced it will continue to attempt to find matches
	
		Once a match is found the callback is fired and the results are stored
	
		The callback for a match is only fired once
	
		If no matches are found and the Speech Recognition API has finished the no match handler will fire
	
	*/
	
	var Matcher = exports.Matcher = function () {
		function Matcher() {
			_classCallCheck(this, Matcher);
		}
	
		_createClass(Matcher, [{
			key: 'match',
			value: function match() {
				var searches = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	
				if ((typeof searches === 'undefined' ? 'undefined' : _typeof(searches)) !== 'object' || !Object.keys(searches).length) {
					return this.throwWarning('match expects an object with a key term and a callback value.');
				}
	
				/*
	    *	If match hasn't been called before add the result callback 
	    *	and create a cache to use to add new searches to
	    */
	
				if (!this.searchForThese) {
					createSearches = addToSearch();
					onResultCallback = resultMatcher.bind(this);
					this.on('result', onResultCallback);
				}
	
				this.searchForThese = createSearches(searches);
	
				// set a default on no match found handler
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
				this.getFirstMatchOnly = false;
				this.match(matches);
			}
		}]);

		return Conversate;
	}();

	/*

	var answers = {
		
	}

	var start = {
		prompt : "What kind of appliance are you looking for?",
		listenFor : ["washing machine", "TV","freezer"],
		success : next,
		fail : "Sorry, I didn't understand that. Try again!",
		found : false
	};

	var next = {
		prompt : "Ok so you're looking for a ${answers[0]}, any particular brand?",
		listenFor : ["hotpoint","sony","samsung"],
		success : next,
		fail : "Sorry, I didn't understand that. Try again!"
	};

	initiate a conversation

	"what products are you looking for?"

	possible answers:

	"washing machine"
	"TV"
	"freezer"

	reply:

	"Ok so you're interested in a ${answer}.
	Any particular brand?"

	possible answers:

	"yes"
	"no"
	"hotpoint"
	"sony"
	"samsung"





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

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
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
	
	var onEnd = exports.onEnd = function onEnd() {
		if (this.autoRestart && this.isListening) {
			return this.start();
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
				return this.throwWarning(e.error);
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
	
	var onResult = function onResult(evt) {
		var _this2 = this;
	
		var isFinalResult = evt.results[0].isFinal;
		var results = [].slice.call(evt.results[0]);
	
		this.eventListeners.result.forEach(function (listener, i) {
			if (i !== 0 && _this2.isListening) {
				listener.boundCallback({ isFinalResult: isFinalResult, results: results });
			}
		});
	};
	
	var TalkToMeBase = exports.TalkToMeBase = function () {
		function TalkToMeBase() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
			_classCallCheck(this, TalkToMeBase);
	
			// get the speech recognition constructor and test for support
	
			var _TalkToMeBase$getSpee = TalkToMeBase.getSpeechRecogniserConstructor();
	
			var speech = _TalkToMeBase$getSpee.speech;
			var support = _TalkToMeBase$getSpee.support;
	
			this.support = support;
	
			if (this.support) {
	
				/*
	    *	Default options (optional)
	    *	Set against the instance of the speech recognition API
	    *	And the instance of Talk To Me
	    */
	
				var numOfAlternativeMatches = options.numOfAlternativeMatches;
				var language = options.language;
				var finalResultsOnly = options.finalResultsOnly;
	
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
					start: [],
					end: [onEnd.bind(this)],
					audioend: [],
					audiostart: [],
					error: [onError.bind(this)],
					nomatch: [],
					result: [resultCallback],
					soundend: [],
					soundstart: [],
					speechend: [],
					speechstart: []
				};
	
				addEventListeners.call(this);
			} else {
				return this.throwWarning('Sorry, no speech recognition ability found in this browser.');
			}
		}
	
		// modify the on no support handler
	
	
		_createClass(TalkToMeBase, [{
			key: 'onNoSupport',
			value: function onNoSupport() {
				var cb = arguments.length <= 0 || arguments[0] === undefined ? defaultNoSupportFunction : arguments[0];
	
				cb();
			}
	
			/*
	   *	Try / catch will prevent errors thrown if start is called when the
	   *	speech recognition API has already started to listen
	   */
	
		}, {
			key: 'start',
			value: function start() {
				this.isListening = true;
				try {
					this.speech.start();
					return true;
				} catch (e) {
					return this.throwWarning(e);
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				this.isListening = false;
				this.speech.abort();
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
					return this.throwWarning(nonCompatibleSpeechRecognitionEventError);
				}
			}
	
			/*
	   *	Removes event listeners from the instance of the speech recognition API 
	   *	Matches the callback, not the bound one as externally there is no reference to it
	   *	Then removes the bound callback counterpart event listener
	   *
	   *	Note: if the penultimate result event listener is removed, Talk To Me's result listener
	   *	is also removed, the instance of the speech recognition API is destroyed and a new one created 
	   *	and the event listeners are re-registered
	   *
	   *	This is specifically designed for the (additional) Matcher module (it won't affect the base class)
	   *	The Matcher module will only ever register one additional result handler 
	   *	and consolidates all searches into a single callback. If it is set to find just the first match 
	   *	it will fire the callback and destroy the instance of the speech recognition API 
	   *	to prevent remaining result events from firing
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
						if (evt !== 'result') {
							this.speech.removeEventListener(evt, this.eventListeners[evt][indexOfCallback].boundCallback);
						}
						this.eventListeners[evt].splice(indexOfCallback, 1);
					} else {
						return this.throwWarning(eventListenerNotFoundError);
					}
	
					if (evt === 'result' && this.eventListeners.result.length === 1) {
	
						this.speech.removeEventListener('result', resultCallback);
	
						var _TalkToMeBase$getSpee2 = TalkToMeBase.getSpeechRecogniserConstructor();
	
						var speech = _TalkToMeBase$getSpee2.speech;
	
						this.speech = new speech();
						addEventListeners.call(this);
					}
				} else {
					return throwWarning(nonCompatibleSpeechRecognitionEventError);
				}
			}
		}, {
			key: 'throwWarning',
			value: function throwWarning(msg) {
				console.warn(msg);
				return false;
			}
		}], [{
			key: 'getSpeechRecogniserConstructor',
			value: function getSpeechRecogniserConstructor() {
				var speech = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
				return { speech: speech, support: !!speech };
			}
		}]);

		return TalkToMeBase;
	}();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=talk-to-me.js.map