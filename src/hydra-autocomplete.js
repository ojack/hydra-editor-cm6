import {syntaxTree} from "@codemirror/language"
import hydraLang from './hydra-lang.js'

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
                        "VariableDefinition", "PropertyDefinition"]

const getObjectFromName = (name = '') => {
    const last = name.split('.')
    return last[last.length - 1].replace('(', '').replace(')', '')
}




const createAutocomplete = ( { srcOptions, externalSourceOptions, combineNames, chainOptions, outputOptions, hydraGlobals }) => (context) => {
    let word = context.matchBefore(/\w*/)

    let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

    console.log('word', word, nodeBefore, nodeBefore.name)

    // if (word.from == word.to && !context.explicit) {
    //   return null
    // }
    // } else {

    // }

    console.log('before', word, nodeBefore, nodeBefore.name,  nodeBefore.parent?.name)
    console.log('children', nodeBefore.parent?.getChildren())
    console.log('exp', nodeBefore.parent?.getChild('Expression'))
    console.log('exp2', nodeBefore.parent?.parent?.getChild('Expression'))
    console.log('exp3', nodeBefore.parent?.parent?.getChild('VariableName'))
    if(nodeBefore.parent?.name === 'ArgList') {
        let object = nodeBefore.parent?.parent?.getChild('Expression')
        let variableName = context.state.sliceDoc(object.from, object.to)
        let lastValue = getObjectFromName(variableName)
        console.log('last value', lastValue, combineNames)
        if(lastValue === 'out') {
          return { from: word.from, options: outputOptions }
        }
        if(combineNames.includes(lastValue)) {
          return { from: word.from, options: [...srcOptions, ...outputOptions, ...externalSourceOptions ] }
        }
        if(lastValue === 'src') {
          return { from: word.from, options: [...externalSourceOptions, ...outputOptions] }
        }
        return null
      //   console.log('completing arguments', variableName, lastValue)
      //  // let object2 = nodeBefore.parent?.parent?.getChild('MemberExpression')
      //  // let variableName2 = context.state.sliceDoc(object2.from, object2.to)
      //  // console.log('completing arguments2', variableName2)
      //   // let variableName = context.state.sliceDoc(object.from, object.to)
      //   console.log('completing arguments', nodeBefore.name, object)
      //   return {
      //       from: word.from,
      //       options: [{ label: 'o0'}]
      //   }
    }
     if (completePropertyAfter.includes(nodeBefore.name) &&
         nodeBefore.parent?.name == "MemberExpression") {
         let object = nodeBefore.parent.getChild("Expression")
         console.log('expression name', object?.name)
         if(object?.name === "VariableName") {
             // s0, s1, a,
             let variableName = context.state.sliceDoc(object.from, object.to)
              console.log('completing properties on object', variableName)
         } else if (object?.name === "CallExpression") {
            let variableName = context.state.sliceDoc(object.from, object.to)
            // if(srcNames.includes(variableName)) {
            //     console.log('hydra source!')
            // }
            return {
                from: word.from,
                options: chainOptions
            }
            console.log('completing expression on object', variableName)
         }
     }
    //   if (object?.name == "VariableName") {
    //     let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
    //     let variableName = context.state.sliceDoc(object.from, object.to)
    //     console.log('completing properties on object', variableName)
    //     if (typeof window[variableName] == "object")
    //       return completeProperties(from, window[variableName])
    //   }
    // } else if (nodeBefore.name == "VariableName") {
    //     console.log('completing properties in global scope', nodeBefore.name)
    //  // return completeProperties(nodeBefore.from, window)
    //     return {
    //         from: word.from, options: [...functionOptions, ...options]
    //     }
    // } else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
    //     console.log(`don't autocomplete`)
    //     return {
    //         from: word.from, options: [...functionOptions, ...options]
    //     }
    //  // return completeProperties(context.pos, window)
    // } else {
    //     console.log(`didnt match any case`)
    //     return null

    // }
    return {
      from: word.from,
    //   options: [
    //     {label: "osc()", apply: "osc()", type: "source", /*detail: "sync, offset, color",*/ info: "sync, offset, color"},
    //     {label: "noise()", type: "source"},
    //     { label: "out()"},
    //     {label: "modulate()", type: "coord"},
    //     {label: "hello", type: "variable", info: "(World)"},
    //     {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
    //   ]
        options: [...srcOptions, ...hydraGlobals]
    }
  }

  export default (hydra) => {
    const autocompleteOptions = hydraLang(hydra)
    return createAutocomplete(autocompleteOptions)
  }

  function completeProperties(from, object) {
    let options = []
    for (let name in object) {
      options.push({
        label: name,
        type: typeof object[name] == "function" ? "function" : "variable"
      })
    }
    return {
      from,
      options,
      validFor: /^[\w$]*$/
    }
  }