'use babel';

import DustHyperclickView from './dust-hyperclick-view';
import { CompositeDisposable } from 'atom';
import path from 'path';


module.exports = {
    config: {
        extensions: {
            description: "Comma separated list of extensions to check for when a file isn't found",
            type: 'array',
            // Default comes from Node's `require.extensions`
            default: [ '.js', '.json', '.node' ],
            items: { type: 'string' },
        },
        usePendingPanes: {
            type: 'boolean',
            default: false,
        },
        jumpToImport: {
            type: 'boolean',
            default: false,
            description: `
            Jump to the import statement instead of leaving the current file.
            You can still click the import to switch files.
            `.trim() // if the description starts with whitespace it doesn't display
        },
    },
    activate() {
        console.log('activate')
        this.subscriptions = new CompositeDisposable()
    },
    getProvider() {
        return makeProvider(this.subscriptions)
    },
    deactivate() {
        console.log('deactivate')
        this.subscriptions.dispose()
    }
}

function makeProvider(subscriptions) {
  console.log('getProvider', subscriptions);
  return {
    getSuggestionForWord(textEditor, text, range) {
      console.log('diuwheu');
      return {
        // The range(s) to underline as a visual cue for clicking.
        range,
        // The function to call when the underlined text is clicked.
        callback() {},
      };
    }
  };
}
