// import './style.css'

import {EditorView, keymap} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands"
import {syntaxHighlighting, defaultHighlightStyle} from "@codemirror/language"
import {javascript} from "@codemirror/lang-javascript"

let myView = new EditorView({
  state: EditorState.create({
    doc: "osc()",
    extensions: [
      history(),
      javascript(),
      syntaxHighlighting(defaultHighlightStyle),
      keymap.of(defaultKeymap)
    ]
  }),
  parent: document.querySelector('#app')
})


