
import {
  keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor, placeholder,
  lineNumbers, highlightActiveLineGutter, EditorView, 
} from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import {
  defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
  foldGutter, foldKeymap
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completeFromList, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"

import { commentKeymap } from '@codemirror/comment';
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from '@codemirror/theme-one-dark';

import { getLine, getBlock, getSelection } from './evalKeymaps.js'
import hydraKeys from './hydra-environment/keymaps.js'

import EventEmitter from 'events'

export default class Editor extends EventEmitter {
  constructor({ parent = document.body, autocompleteOptions = [] } = {}) {
    super()
    const self = this
    const hydraKeymaps = Object.entries(hydraKeys).map(([key, val]) => ({
      key: key,
      run: (opts) => {
        console.log('called', val, opts)
        let text = ''
        if(val === 'editor:evalLine') {
          text = getLine(opts)
        } else if (val === 'editor:evalBlock') {
          text = getBlock(opts)
        }
        console.log('text', text)
        self.emit(val, text)
      }
    }))
    this.cm = new EditorView({
      // lineWrapping: true,
      state: EditorState.create({
        // doc: "osc()",
        lineWrapping: true,
        extensions: [
          // lineNumbers(),
          // highlightActiveLineGutter(),
          placeholder('code here'),
          // lineWrapping(),
          highlightSpecialChars(),
          history(),
          // foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorView.lineWrapping,
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ 
           override: [autocompleteOptions]
          }),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            ...commentKeymap,
            // ...evalKeymap
            ...hydraKeymaps
          ]),
          javascript(),
          EditorView.theme({
            '&': {
              backgroundColor: 'transparent',
              fontSize: '20px',
            },
            '& .cm-line': {
              maxWidth: 'fit-content',
              // background: 'hsla(50,23%,5%,0.6)',
              background: 'rgba(0, 0, 0, 0.8)'
            },
            '&.cm-focused': {
              outline: 'none',
            },
            // // adds word wrapping
            // '.cm-content': {
            //   whiteSpace: 'pre-wrap'
            // }
          }),
          oneDark
        ]
      }),
      parent: parent
    })
  }
}



