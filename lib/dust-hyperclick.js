'use babel';

// import DustHyperclickView from './dust-hyperclick-view';
import { CompositeDisposable, Range, File } from 'atom';
import path from 'path';

// module.exports = {
export default {
    // dustHyperclickView: null,
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
        // this.dustHyperclickView.destroy();
    },
};

export function getHyperclickProvider() {
    console.log('bla/mobile/getProvider/erted/directly');
    return {
        getSuggestionForWord(textEditor, text, range) {
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

                const baseDir = path.dirname(textEditor.getPath())

                let pathToOpen = '';
                if (baseDir.indexOf('/mobile/') > -1) {
                    var dirs = baseDir.split('/mobile/');
                    pathToOpen = dirs[0] + '/mobile/' + fileToOpen;
                }

                if (baseDir.indexOf('/desktop/') > -1) {
                    var dirs = baseDir.split('/desktop/');
                    pathToOpen = dirs[0] + '/desktop/' + fileToOpen;
                }

                console.log('#', pathToOpen);

                new File(pathToOpen).exists().then(function(exists){
                    if (exists) {
                        atom.workspace.open(pathToOpen);
                    } else {
                        console.log('does not exist -> try shared component');
                        openSharedComponent(pathToOpen);
                    }
                });
            },
          };
        }
    };
}

function openSharedComponent(pathToOpen) {
    if (pathToOpen.indexOf('/mobile/')) {
        var nextPath = pathToOpen.replace('/mobile/', '/desktop/');
        console.log(nextPath);
        var file = new File(nextPath);
        file.exists().then(function(exists){
            if (exists) {
                atom.workspace.open(nextPath);
            } else {
                console.log('does not exist -> try inheritance');
                openInheritance(pathToOpen);
            }
        });
    } else {
        console.log('not mobile');
        openInheritance(pathToOpen);
    }
}

function openInheritance(pathToOpen) {
    let nextPath = '';
    let inheritance = '';

    // default -> base -> puc-de -> puc-at
    if (pathToOpen.indexOf('/base/') > -1) {
        inheritance = '/default/';
        nextPath = pathToOpen.replace('/base/', inheritance);
    } else if (pathToOpen.indexOf('/puc-de/') > -1) {
        inheritance = '/base/';
        nextPath = pathToOpen.replace('/puc-de/', inheritance);
    } else if (pathToOpen.indexOf('/puc-at/') > -1) {
        inheritance = '/puc-de/';
        nextPath = pathToOpen.replace('/puc-at/', inheritance);
    } else {
        showMessage('not found');
        return;
    }

    console.log(nextPath);

    if (nextPath.length) {
        new File(nextPath).exists().then(function(exists){
            if (exists) {
                showMessage('inherited from ' + inheritance.split('/').join(''));
                atom.workspace.open(nextPath);
            } else {
                console.log('does not exist -> try next inheritance');
                openInheritance(nextPath);
            }
        });
    } else {
        console.log('no inheritance');
    }
}

function showMessage(message) {
    atom.notifications.addInfo(message, {});
}
