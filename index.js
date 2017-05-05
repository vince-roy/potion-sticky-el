import StickyEl from './sticky-el'

/**
 * 
 * Makes an element "sticky" or "creeping"
 * 
 * @param el {string} Selector string for the sticky element
 * @param end_el {string} Selector string for the element that represents the limit of the sticky element
 * @param mq {string} media query at which the plugin should function
 */
export default (el_selector, end_el_selector, opts) => {
  let $el = document.querySelector(el_selector)
  let $end_el = document.querySelector(end_el_selector)
  return StickyEl($el, $end_el, opts).create()
}