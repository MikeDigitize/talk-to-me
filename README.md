# Talk to me

Talk to me is a wrapper around the speech recognition API from which you can create custom builds to search your needs. 

### Usage

Either `import`, `require` or add a script tag with the source to get access to class `TalkToMe`.

```javascript
const ttm = new TalkToMe(options);
```
### Options

`TalkToMe` takes an optional object of options to pre-configure the speech recognition API.

```javascript
// options
$param {Number} numOfAlternativeMatches // defaults to 5
$param {String} language  // defaults to 'en-us'
```

### Light version

The light version is the base class and available in the `build` folder as `talk-to-me-light` or by running `gulp light`. To manually extend the base class import `talk-to-me.js` in to your project.

### Base functionality

Create a new version of `TalkToMe`.

```javascript
var ttm = new TalkToMe(); // takes an optional options object
```

By default you can start your instance of `TalkToMe` recording by running
```javascript
ttm.start();
```
but seeing as though you haven't defined any events to listen to, nothing will happen, apart from after a while, if no sound has been made, you'll be warned in the console that the Speech Recognition API hasn't received any audio input.

So you'll probably want to add an event listener(s) to catch events that fire from the Speech Recognition API.

### Supported events

The following events are supported by the Speech Recognition API.

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

If you try and register an unsupported event you'll get a console warning from your instance of `TalkToMe`. To listen for an event use the `on` method. The `result` event gives you the results of the attempt at speech recognition.

```javascript
function onResult(event) {
  // the event object contains a results property with result data
}
ttm.on('result', onResults);

```

Run 
```javascript
ttm.start()
```

again and your callback will fire whenever it gets a result. 

### Auto-restarting recording

However once it finishes analysing the results the recording will stop. To keep recording continuous set the `autoRestart` property to true.

```javascript
ttm.autoRestart = true;
```

### Removing a callback
Easy. Just use the off method passing in the event name and the callback.

```javascript
ttm.off('result', onResult);
```

### Non-supporting browsers

By default `TalkToMe` will just fire an alert message informing the user it doesn't support their browser but this can be overridden by passing a response function to the `onNoSupport` method, which fires if no support is detected when initialising an instance of the class.

```javascript
ttm.onNoSupport(function() {
  // do something with non supporting browsers
});
```

And that's the base class. It's only 3kb and lets you build an application using just the essentials of the Speech Recognition API.

