import Editor from './src/editor.js'
import repl from './src/hydra-environment/repl.js'
import createHydraAutocomplete from './src/hydra-autocomplete.js'

const hydra = new Hydra()
osc(4, 0.1, 1.2).out()



const autocomplete = createHydraAutocomplete(hydra)

const editor = new Editor({ parent: document.querySelector('#app'), autocompleteOptions: autocomplete })

editor.on('editor:evalLine', (line) => {
    console.log('called eval line!')
    repl.eval(line)
})

editor.on('editor:evalBlock', (line) => {
    console.log('called eval line!')
    repl.eval(line)
})

window.hydra = hydra
