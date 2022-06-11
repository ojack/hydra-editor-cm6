import Editor from './editor.js'
import repl from './hydra-environment/repl.js'
// import Hydra from 'hydra-synth'

// if (typeof (window as any).global === 'undefined') {
//     (window as any).global = window;
//   }

const editor = new Editor({ parent: document.querySelector('#app') })

editor.on('editor:evalLine', (line) => {
    console.log('called eval line!')
    repl.eval(line)
})

editor.on('editor:evalBlock', (line) => {
    console.log('called eval line!')
    repl.eval(line)
})

const hydra = new Hydra()
osc(4, 0.1, 1.2).out()