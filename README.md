# Talk to me

Talk to me is a wrapper around the speech recognition API from which you can create custom builds to suit your needs. 

### Usage

Either `import`, `require` or add a script tag with the source to get access to the class `TalkToMe`. As `TalkToMe` is just a class the original, non-transpiled version in the `src` directory will work just fine if you're working exclusively in ES2015 compliant browsers.

```javascript
const ttm = new TalkToMe();
```
### Options

`TalkToMe` takes an optional object of options to pre-configure the speech recognition API.

```javascript
/*
 * $param {Number} numOfAlternativeMatches // the Speech Recognition API can suggest alternatives
 * $param {String} language  // the language to listen for
 * $param {Boolean} finalResultsOnly  // whether to report back guesses at speech analysis or final results only
*/

const language = 'en-us'; // defaults to 'en-us'
const numOfAlternativeMatches = 5 // defaults to 5
const finalResultsOnly = false; // defaults to false
const ttm = new TalkToMe({ language, numOfAlternativeMatches, finalResultsOnly });
```

### Light version

The light version is the base class and available in the `build` folder as `talk-to-me-light` or generates by running `gulp light` after you've run `npm i` in your project directory. To manually build on the base class import `talk-to-me.js` in to your project and extend it:

```javascript
class TalkToMeSomeMore extends TalkToMe {
  // your extension
}
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

If you try and register an unsupported event you'll get a console warning from your instance of `TalkToMe`. To add an event use the `on` method.

```javascript
/*
 * $param {String} evt
 * $param {Function} callback
 */
ttm.on('supported-event', callback);
```

### The result event

The `result` event is probably the most important event that the Speech Recognition API fires as it contains the results of the recording analysis. `TalkToMe` heavily modifies the native event object the Speech Recognition API produces to make it easier to analyse results.

The modified event object contains two properties: `isFinalResult` - a Boolean that indicates if the Speech Recognition API has finishd analysis. If you've specified `finalResultsOnly` to be `true` when creating your instance of `TalkToMe` you'll only get final results and `results`, an array of analysis result objects each of which contain two properties - `confidence` a floating point Number between 0 and 1 indicating the API's confidence in the result and `transcript` which is a String representation of the speech analysis.

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
ttm.start()
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

And that's the base class. It's only 7kb before minification and lets you build an application using just the essentials of the Speech Recognition API.

