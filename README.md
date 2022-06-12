WIP [hydra](https://hydra.ojack.xyz) editor built using Codemirror6

Code inspiration from: https://github.com/folz/hiasynth/tree/main/packages/editor

To implement:
- flash highlighting on evaluation
///- autocomplete
///- custom keymaps
- internationalization
- bundle as module as well as standalone editor with iframe API that can be used along with hydra-synth

Already implemented:
- bracket matching
- multi-selection
- key command for commenting code

Autocomplete ideas:
- include common code snippets
- allow to prepopulate with random reasonable values, or with defaults
- snippet completion? https://github.com/codemirror/lang-javascript/blob/main/src/snippets.ts
- move parameter hints to tooltips rather than autocomplete
- draggable parameters similar to glslEditor / chrome dev tools (widget decoration)