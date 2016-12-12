'use babel';

import DustHyperclickView from './dust-hyperclick-view';
import { CompositeDisposable, Point, Range, File } from 'atom';
import path from 'path';



// module.exports = {
export default {

  dustHyperclickView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // this.dustHyperclickView = new DustHyperclickView(state.dustHyperclickViewState);
    // this.modalPanel = atom.workspace.addModalPanel({
    //   item: this.dustHyperclickView.getElement(),
    //   visible: false
    // });
    //
    // console.log('activated');
    // // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    // this.subscriptions = new CompositeDisposable();
    //
    // // Register command that toggles this view
    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'dust-hyperclick:toggle': () => this.toggle()
    // }));

    this.subscriptions = new CompositeDisposable()
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.dustHyperclickView.destroy();
  },

  serialize() {
    return {
      dustHyperclickViewState: this.dustHyperclickView.serialize()
    };
  },

  toggle() {
    // console.log('DustHyperclick was toggled!');
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
    console.log('dust hyperclick')

      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
        let selection = editor.getSelectedText()
        let reversed = selection.split('').reverse().join('')
        editor.insertText(reversed)

        // const baseDir = editor.getPath()
        const baseDir = path.dirname(editor.getPath())
        console.log(baseDir);

        // let path = baseDir + '/dust-hyperclick-view.js';
        // let path = 'dust-hyperclick-view.js';
        console.log(atom.project.getPaths());
        console.log(atom.project.relativizePath(baseDir));

        // let path = './package.json';
        let filePath = '/package.json';
        console.log(filePath);
        const params = {
            pathsToOpen: [filePath],
            newWindow: false,
        }

        // editor.get
        // opens in new atom window
        // atom.open(params);
        console.log('--- --- ---');
        let pathToOpen = baseDir + '/..' +filePath;
        console.log(pathToOpen);
        atom.workspace.open(pathToOpen);
        // atom.workspace.open("/Users/benjaminmock/github/dust-hyperclick" + filePath);
        // atom.open([path], true);
      }
  },
  //
  // getHyperclickProvider() {
  //   console.log('getProvider');
  //   return {
  //     getSuggestionForWord(textEditor, text, range) {
  //       console.log('orpnoeeno');
  //       return {
  //         // The range(s) to underline as a visual cue for clicking.
  //         range,
  //         // The function to call when the underlined text is clicked.
  //         callback() {},
  //       };
  //     }
  //   };
  // },

};

export function getHyperclickProvider() {
  console.log('getProvider/erted/directly');
  return {
    getSuggestionForWord(textEditor, text, range) {
      console.log('orpnoeeno');
      return {
        // The range(s) to underline as a visual cue for clicking.
        range,
        // The function to call when the underlined text is clicked.
        callback() {
            var newStart = range.start.column;
            var prefix = '';
            var separator = '';

            console.log('starting');

            while(prefix !== "'" && prefix !== '"') {
                newStart--;
                if (newStart < 0) {
                    console.log('not found');
                    return;
                }
                var newRange = new Range([range.start.row, newStart], [range.start.row, range.start.column]);
                prefix = textEditor.getTextInBufferRange(newRange)[0];
                separator = prefix;
            }

            console.log('got prefix', newStart)
            var newEnd = range.end.column;
            var postfix = '';
            while(postfix !== separator) {
                newEnd++;
                // TODO check for maxlength of line
                var newRange = new Range([range.end.row, range.end.column], [range.end.row, newEnd]);
                postfix = textEditor.getTextInBufferRange(newRange);
                postfix = postfix[postfix.length-1];
            }

            var newRange = new Range([range.end.row, newStart], [range.end.row, newEnd]);
            var fileToOpen = textEditor.getTextInBufferRange(newRange).split(separator).join('') + '.dust';
            // TODO actually open file
            console.log(fileToOpen);

            const baseDir = path.dirname(textEditor.getPath())
            console.log(baseDir);

            // var paths = atom.project.getPaths();
            // var projectPath = paths.length > 0 paths[0] : '';
            // console.log(paths);

            let pathToOpen = baseDir + '/../' + fileToOpen;
            console.log(pathToOpen);

            // TODO template inheritance
            // TODO shared components mobile -> desktop

            var file = new File(pathToOpen);
            file.exists().then(function(exists){
                if (exists) {
                    atom.workspace.open(pathToOpen);
                } else {
                    console.log('does not exist');
                }
            });
        },
      };
    }
  };
}


// export function getHyperclickProvider() {
//     console.log('ideidiehihi');
// }
//
// export var provider: HyperclickProvider = {
//   providerName: 'LOVE2D Hyperclick',
//   getSuggestionForWord(editor: atom$TextEditor, query: string, range: atom$Range): ?HyperclickSuggestion  {
//     // Extemd the range of the token backwards.
//     var prefix = editor.getTextInBufferRange(new Range(new Point(range.start.row, 0), range.start));
//     var prefixMatch = prefix.match(PREFIX_REGEX);
//     if (prefixMatch) {
//       query = prefixMatch[0] + query;
//       range = new Range(new Point(range.start.row, range.start.column - prefixMatch[0].length), range.end);
//     }
//
//     // Extend the range of the token forwards.
//     var suffix = editor.getTextInBufferRange(new Range(range.end, new Point(range.end.row, Number.MAX_SAFE_INTEGER)));
//     var suffixMatch = suffix.match(SUFFIX_REGEX);
//     if (suffixMatch) {
//       query = query + suffixMatch[0];
//       range = new Range(range.start, new Point(range.end.row, range.end.column + suffixMatch[0].length));
//     }
//
//     // If a mapping exists for this query, open the URL.
//     if (URLS[query]) {
//       return {
//         range: range,
//         callback() { shell.openExternal(URLS[query].url); },
//       };
//     } else {
//       return null;
//     }
// 	},
// };




// export function getHyperclickProvider() {
//   console.log('getProvider');
//   return {
//     getSuggestionForWord(textEditor, text, range) {
//       return {
//           console.log('orpnono');
//         // The range(s) to underline as a visual cue for clicking.
//         range,
//         // The function to call when the underlined text is clicked.
//         callback() {},
//       };
//     }
//   };
// }



// export function getProvider() {
//   console.log('getProvider');
//   return {
//     getSuggestionForWord(
//       textEditor: TextEditor,
//       text: string,
//       range: Range
//     ): ?HyperclickSuggestion {
//       return {
//         // The range(s) to underline as a visual cue for clicking.
//         range,
//         // The function to call when the underlined text is clicked.
//         callback() {},
//       };
//     },
//   };
// }

// function resolveModule(textEditor, module) {
//     const basedir = path.dirname(textEditor.getPath())
//     const options = {
//         basedir,
//         extensions: atom.config.get('js-hyperclick.extensions')
//     }
//
//     try {
//         const filename = resolve(module, options)
//         if (filename == module) {
//             return `http://nodejs.org/api/${module}.html`
//         }
//         return filename
//     } catch (e) {
//         /* do nothing */
//     }
//
//     // Allow linking to relative files that don't exist yet.
//     if (module[0] === '.') {
//         if (path.extname(module) == '') {
//             module += '.js'
//         }
//
//         return path.join(basedir, module)
//     } else {
//         return resolveWithCustomRoots(basedir, module)
//     }
// }

// export default function(textEditor, text, range, cache) {
function getSuggestionForWord(textEditor, text, range) {
    console.log('dkeokdeokdoeo');
    return null;
    // if (text.length === 0) {
    //     return null
    // }
    // const { parseError, paths, scopes, externalModules } = cache.get(textEditor)
    // if (parseError) {
    //     return {
    //         range,
    //         callback() {
    //             const [ projectPath, relativePath ] = atom.project.relativizePath(textEditor.getPath())
    //             void(projectPath)
    //
    //             atom.notifications.addError(`js-hyperclick: error parsing ${relativePath}`, {
    //                 detail: parseError.message
    //             })
    //         }
    //     }
    // }
    //
    // const start = textEditor.buffer.characterIndexForPosition(range.start)
    // const end = textEditor.buffer.characterIndexForPosition(range.end)
    //
    // for (let i = 0; i < paths.length; i++) {
    //     const path = paths[i]
    //     if (path.start > end) { break }
    //     if (path.start < start && path.end > end) {
    //         return pathResult(path, textEditor, cache)
    //     }
    // }
    //
    // const closestScope = findClosestScope(scopes, start, end)
    //
    // // Sometimes it reports it has a binding, but it can't actually get the
    // // binding
    // if (closestScope.hasBinding(text) && closestScope.getBinding(text)) {
    //
    //     const binding = closestScope.getBinding(text)
    //     const { line, column } =  binding.identifier.loc.start
    //
    //     const clickedDeclaration = (line - 1 == range.start.row && column == range.start.column)
    //     const crossFiles = !atom.config.get('js-hyperclick.jumpToImport')
    //
    //     if (clickedDeclaration || crossFiles) {
    //         const module = externalModules.find((m) => {
    //             const { start: bindingStart } = binding.identifier
    //             return m.local == text && m.start == bindingStart
    //         })
    //
    //         if (module) {
    //             return moduleResult(module, textEditor, range, cache)
    //         }
    //     }
    //
    //     // Exit early if you clicked on where the variable is declared
    //     if (clickedDeclaration) {
    //         return null
    //     }
    //
    //     return {
    //         range,
    //         callback() {
    //             textEditor.setCursorBufferPosition([line - 1, column])
    //             textEditor.scrollToCursorPosition()
    //         }
    //     }
    // }
}
