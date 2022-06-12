import { syntaxTree } from "@codemirror/language"
import hydraLang from './hydra-lang.js'

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
  "VariableDefinition", "PropertyDefinition"]

const getObjectFromName = (name = '') => {
  const last = name.split('.')
  return last[last.length - 1].replace('(', '').replace(')', '')
}

const getFunctionText = (f = () => { }) => {
  const str = f.toString()
  return str.split("{")[0]
}



const createAutocomplete = ({ hydraConstants, srcOptions, externalSourceOptions, combineNames, chainOptions, outputOptions, hydraGlobals }) => (context) => {
  let word = context.matchBefore(/\w*/)

  let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

  console.log('word', word, nodeBefore, nodeBefore.name)

  // if (word.from == word.to && !context.explicit) {
  //   return null
  // }
  // } else {

  // }
  const parseArguments = (node) => {
    let object = node.parent?.getChild('Expression')
    let variableName = context.state.sliceDoc(object.from, object.to)
    let lastValue = getObjectFromName(variableName)
    console.log('last value', lastValue, combineNames)
    if (lastValue === 'out') {
      return outputOptions
    }
    if (combineNames.includes(lastValue)) {
      return [...srcOptions, ...outputOptions, ...externalSourceOptions]
    }
  if (lastValue === 'src') {
    return [...externalSourceOptions, ...outputOptions]
  }
  return []
}

console.log('before', nodeBefore.name, nodeBefore.parent?.name, nodeBefore.parent?.parent?.name,)
console.log('children', nodeBefore.parent?.getChildren())
console.log('exp', nodeBefore.parent?.getChild('Expression'))
console.log('exp2', nodeBefore.parent?.parent?.getChild('Expression'))
console.log('exp3', nodeBefore.parent?.parent?.getChild('VariableName'))
if (nodeBefore.name === 'ArrowFunction' || nodeBefore.parent?.name === 'ArrowFunction') {
  console.log('arrow function!')
  return { from: word.from, options: [...hydraConstants] }
}

// filling in parameters inside parenthesis
if (nodeBefore.parent?.name === 'ArgList') {
  const options = parseArguments(nodeBefore.parent)
  return { from: word.from, options }
}

if (nodeBefore.name === 'ArgList') {
  const options = parseArguments(nodeBefore)
  return { from: word.from, options }
}

// following a '.'
if (completePropertyAfter.includes(nodeBefore.name) &&
  nodeBefore.parent?.name == "MemberExpression") {
  let object = nodeBefore.parent.getChild("Expression")
  console.log('expression name', object?.name)
  // object such as s0, s1, or a
  if (object?.name === "VariableName") {
    // s0, s1, a,
    let variableName = context.state.sliceDoc(object.from, object.to)
    console.log('completing properties on object', variableName)
    const obj = window[variableName]
    if (nodeBefore.parent?.parent?.name === 'ArrowFunction') {
      const options = Object.keys(obj).map((o) => ({ label: o }))
      console.log('calculating options', options)
      return { from: word.from, options }
    } else {
      const options = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).map((o) => ({ label: o, info: getFunctionText(obj[o]) }))
      return { from: word.from, options }
    }
    console.log('completeing props for', typeof obj, obj.constructor.name)
    // after a hydra function such as osc()
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