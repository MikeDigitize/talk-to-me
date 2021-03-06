# Talk to me

Talk To Me is a wrapper around the Speech Recognition API that massively simplifies its usage. It's been built in a very specific way, firstly to provide you with a base class that makes all the out-of-the-box functionality super easy to use and secondly to allow you to easily 'bolt on' any additional functionality in the form or additional classes so you can create a custom build to suit your needs.

### Customise 

Edit the `talk-to-me.js` file and add required additional modules to the `Combine` function as a second argument. For multiple extensions wrap them in an array. For example:

```javascript
export var TalkToMe = Combine(TalkToMeBase, [Matcher, Conversate]);

```

will give you the base wrapper class plus the additional functionality from the `Matcher` and `Conversate` bolt-on classes.

```javascript
// just the base wrapper
export var TalkToMe = Combine(TalkToMeBase);

// the base wrapper with the additional Matcher class added
export var TalkToMe = Combine(TalkToMeBase, Matcher);

```

Just run `gulp` when you're done and you'll get a `talk-to-me.js` file which exposes a `TalkToMe` class with your specified functionality. 

### Usage

Either `import`, `require` or add a script tag with the source to get access to the class `TalkToMe`.

```javascript
const ttm = new TalkToMe();

```
### Options

`TalkToMe` takes an optional object of options to pre-configure the speech recognition API.

```javascript
/*
 * $param {Number} numOfAlternativeMatches // the Speech Recognition API can suggest alternative matches
 * $param {String} language  // the language to listen for
 * $param {Boolean} finalResultsOnly  // whether to report back guesses at speech analysis or final results only
*/

const language = 'en-us'; // defaults to 'en-us'
const numOfAlternativeMatches = 5 // defaults to 5
const finalResultsOnly = false; // defaults to false

const ttm = new TalkToMe({ language, numOfAlternativeMatches, finalResultsOnly });

```

### Base functionality

From the offset you can start your instance of `TalkToMe` recording audio from the microphone by running

```javascript
const ttm = new TalkToMe(); 
ttm.start();

```
but seeing as though you haven't defined any events to respond to, nothing will happen, apart from after a while if no sound has been made, you'll be warned in the console that the Speech Recognition API hasn't received any audio input.

### Adding events

To add an event listener(s) to catch events that fire from the Speech Recognition API use the `on` method. The following events are supported by the Speech Recognition API.

* start
* end
* audioend
* audiostart
* error
* nomatch
* result
* soundend
* soundstart
* speechend
* speechstart

If you try and register an unsupported event you'll get a console warning from your instance of `TalkToMe`.

```javascript
/*
 * $param {String} evt
 * $param {Function} callback
 */
ttm.on('supported-event', callback);

```

### The result event

The `result` event is probably the most important event that the Speech Recognition API fires as it contains the results of the recording analysis. `TalkToMe` heavily modifies the native event object the Speech Recognition API produces to make it easier to analyse results.

The modified event object contains two properties: 

`isFinalResult` - a Boolean that indicates if the Speech Recognition API has finished analysis. If you've specified `finalResultsOnly` to be `true` when creating your instance of `TalkToMe` you'll only get final results.

`results` - an array of analysis result objects each of which contain two properties: `confidence` a floating point Number between 0 and 1 indicating the API's confidence in the result and `transcript` which is a String representation of the speech analysis.

```javascript
// basic usage example
const searchFor = 'Talk To Me';
function onResult(event) {
  if(event.isFinalResult) {
      const match = event.results.filter(result => result.transcript === searchFor);
      if(match.length) {
        // success!!
      }
      else {
        // falied!
      }
  }
}
ttm.on('result', onResults);
ttm.start();

```

Run `start` again and your callback will fire whenever it gets a result. Every time you add new events you'll have to run `start` again. You don't have to stop it before starting. 

### Auto-restarting recording

Once `TalkToMe` finishes analysing the results the recording will stop. To keep recording continuously set the `autoRestart` property to true.

```javascript
ttm.autoRestart = true;

```

You can set this to false at any point during recording and when the next speech `end` event fires `TalkToMe` will not restart.

### Removing a callback
Use the `off` method passing in the event name and the callback to remove.

```javascript
/*
 * $param {String} evt
 * $param {Function} callback
 */
ttm.off('result', onResult);

```

### Non-supporting browsers

Instances of `TalkToMe` have an `onNoSupport` method which when called, and if no support is detected when initialising an instance of the class, will by default show an alert box informing the user that their browser isn't supported but this can be overridden by passing a replacement function in to the method.

```javascript
/*
 * $param {Function} callback
 */
ttm.onNoSupport(function() {
  // do something with non supporting browsers
});

```

### Matcher build

The matcher build is the base class but with a few additional methods that allow you to scan results for specific terms and run callbacks when a match is found. Just pop the `Matcher` class as a second argument into the base class's `Combine` function to get these methods.

### Matcher functionality

The matcher expansion provides three new methods to the base class - `match`, `noMatch` and `removeMatchTerm`.

### Matching terms and phrases

The `match` method is used to search speech recognition results for specific terms and fire specific callbacks if it finds them. It takes an object as an argument that has for its keys search terms and the corresponding values being the callback to fire when that term is found. When a match is found the matched term, the actual result found by the Speech Recognition API and whether it is the final result are passed in to the callback as part of a results object.

```javascript

/*
 * $param {String} (key) // the word to match against
 * $param {Function} (value) // the callback to fire when the key is matched
*/


function onMatch(event) {
  console.log(`So you're interested in ${event.term}?`);
  console.log(event.matches, event.isFinalResult);
}

var ttm = new TalkToMe();
ttm.match({ 
  'super heroes' : onMatch,
  'video games' : onMatch
});
ttm.start();

```

### When no matches are found

The `noMatch` method takes a callback that fires when no matches are found. By default `TalkToMe` will show a warning in the console when that's the case. An array of the final results returned from the Speech Recognition API is passed into the callback.

```javascript

/*
 * $param {Function} callback // the callback to fire when no matches are found
*/
function onNoMatches(results) {
  console.log(`Sorry, do you want to try saying that again?`, results);
}
ttm.noMatch(onNoMatches);

```

Both the `match` and `noMatch` methods have the instance of `TalkToMe` they belong to bound to them so any instance properties are accessible within the callbacks.

### Removing a term

If the `autorestart` property is set to true, after a successful result(s) or when the final result comes back and no match is found TalkToMe will start listening for audio again and will re-analyse results against any search terms that have been entered. To remove a search term use the `removeMatchTerm` method.

```javascript

/*
 * $param {String} term // the search term to remove from the stored terms and callbacks
*/
ttm.removeMatchTerm('super heroes')

// example usage

function onMatch(term) {
  console.log(`So you're interested in ${term}?`);
  this.removeMatchTerm(term);
  if(!Object.keys(this.searchForThese).length) {
      this.stop();
  }
}

var ttm = new TalkToMe();
ttm.match({ 
  'super heroes' : onMatch,
  'video games' : onMatch
});
ttm.start();


```

### Coming next

* A UI for conversations
* An expansion to create a conversation tree

### Licence

MIT. If this is of any use to anyone - great!
Also - contributors welcome!
