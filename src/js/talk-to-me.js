import annyang from 'js/annyang';

let allow = true;

let categories = ['washing machine', 'dishwasher', 'fridge', 'freezer', 'TV', 'microwave'];

function createCommands(...keywords) {
  let commands = {};
  function callback(keyword) {
    SpeechKITT.setInstructionsText(`So you want to shop for ${keyword}?`);
    SpeechKITT.vroom();
  }
  keywords.forEach(keyword => {
    commands[keyword] = callback.bind(null, keyword)
  });
  return commands;
}

// Add our commands to annyang
annyang.addCommands(createCommands('washing machines', 'dishwashers', 'fridges', 'freezers', 'TVs'));

// Tell KITT to use annyang
SpeechKITT.annyang();

SpeechKITT.setInstructionsText('What would you like to shop for today?');

// Render KITT's interface
SpeechKITT.vroom();

SpeechKITT.startRecognition();
annyang.trigger('What would you like to shop for today?');
annyang.addCallback('result', checkforMatches);

function checkforMatches(result) {
  let match;
  if(allow) {
    match = checkForCategories(result.speech, categories);
    if(match.found) {
      allow = false;
    }
    console.log(match);
  }
  if(result.isFinalResult) {
    allow = true;
  }
}

function checkForCategories(results, cats) {
  return results.reduce((match, phrase) => {
    let check = searchForCategoryText(phrase.text, cats);
    match.phrase = phrase.text;
    if(check.found) {
      match = check;
    }
    return match;
  }, { found : false, phrase : ''});
}

function pluraliseWord(word) {
  return /s$/i.test(word) ? word : `${word}s`;
}

function pluraliseRegex(word) {
  return new RegExp(`${word}s?`, 'g');
}

function searchForCategoryText(phrase, collection) {
  return collection.reduce((match, category) => {
      let reg = pluraliseRegex(category);
      if(phrase.match(reg) !== null) {
        match.found = true;
        match.phrase = pluraliseWord(category);
      }
      return match;
  }, { found : false, phrase : ''})
}