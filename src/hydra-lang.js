import hydraFunctions from 'hydra-synth/src/glsl/glsl-functions'

export default (hydra) => {
    const hydraGlobals = Object.entries(hydra.synth).map(([key, val]) => {
      console.log(key, val, typeof val)
      let label = key
      let type = typeof val
      if(type === "function") {
          label += '()'
      } else if (type === 'object') {
          type = val.constructor.name
      }
    //  if(typeof val === "object") console.log(val.constructor.name)
      return {
      label: label,
      type: type,
      detail: type,
      info: type
      // info: JSON.stringify(val)
    }})
  
    const hydraFuncs = hydraFunctions()
    const functionOptions = hydraFuncs.map((h) => ({ 
        label: `${h.name}()`, type: h.type, 
        info:  h.inputs !== undefined ? `${h.name}( ${h.inputs.map((input) => `${input.name}${input.default ? ` = ${input.default}`: ''}`).join(', ')} )` : ''
    }))
  
    functionOptions.push({ label: `out()` })
  
    const srcOptions = functionOptions.filter((h) => h.type === 'src')
    const chainOptions = functionOptions.filter((h) => h.type != 'src')
    
    return { srcOptions, chainOptions, hydraGlobals }
  }