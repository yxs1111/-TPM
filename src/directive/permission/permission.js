
export default {
  inserted(el, binding, vnode) {
    
    const bitResult = vnode.context.$route.meta.bitResult
    const { value } = binding
    const hasPermission = (!isNaN(value)) && bitResult && ((bitResult & (1 << value)) === (1 << value))
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
