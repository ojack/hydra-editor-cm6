// import './style.css'

import { drawSelection, EditorView, keymap} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands"
import {syntaxHighlighting, defaultHighlightStyle, bracketMatching} from "@codemirror/language"
import {javascript} from "@codemirror/lang-javascript"
import { commentKeymap } from '@codemirror/comment';
import { oneDark } from '@codemirror/theme-one-dark';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { autocompletion } from '@codemirror/autocomplete';

// import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
// import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
// import { bracketMatching } from '@codemirror/matchbrackets';

let myView = new EditorView({
  state: EditorState.create({
    doc: "osc()",
    extensions: [
      history(),
      drawSelection(),
      javascript(),
      // autocompletion(),
      highlightSelectionMatches(),
      syntaxHighlighting(defaultHighlightStyle),
      bracketMatching(),
      keymap.of([...defaultKeymap,   ...searchKeymap, ...commentKeymap, ...historyKeymap]),
      EditorView.theme({
        '&': {
          backgroundColor: 'transparent',
          fontSize: '20px',
        },
        '& .cm-line': {
          maxWidth: 'fit-content',
          background: 'hsla(50,23%,5%,0.6)',
        },
        '&.cm-focused': {
          outline: 'none',
        },
      }),
      oneDark
    ]
  }),
  parent: document.querySelector('#app')
})


