import optimizeEvent from './optimizeEvent'
import StickyEl from './sticky-el'

/**
 * 
 * Makes an element "sticky" or "creeping"
 * 
 * @param el {string} Selector string for the sticky element
 * @param end_el {string} Selector string for the element that represents the limit of the sticky element
 * @param mq {string} media query at which the plugin should function
 */
export default ({wrapper, el}, opts) => {
  let $el = document.querySelector(el)
  let $wrap_el = document.querySelector(wrapper)
  if (!"o-resize" in window) {
    optimizeEvent('resize', 'o-resize', window);
  }
  if (!"o-scroll" in window) {
	  optimizeEvent('scroll', 'o-scroll', window);
  }
  return StickyEl($el, $wrap_el, opts).create()
}
