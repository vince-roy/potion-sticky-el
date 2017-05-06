export default ($el, $end_el, opts) => ({
  applyStyles (styles) {
    Object.keys(styles).forEach(s => {
      this.$el.style[s] = styles[s]
    })
    return this.$el
  },
  bounds (el) {
    let bounds = el.getBoundingClientRect()
    return {
      bottom: bounds.bottom,
      left: bounds.left,
      height: bounds.bottom - bounds.top,
      top: bounds.top,
      width: bounds.right - bounds.left
    }
  },
  /*
    Configurable defaults
  */
  config: {
    spacing: {
      bottom: 0,
      top: 10
    },
    mq: '(min-width: 768px)'
  },
  /*
    Create instance of the plugin
  */
  create () {
    if (!$el || !$end_el) return
    Object.assign(this, {
      $el,
      $end_el
    })
    Object.assign(this.config.spacing, opts.spacing)
    this.config.mq = opts.mq || this.config.mq
    this.onScrollBound = this.onScroll.bind(this)
    this.init()
    window.addEventListener('o-resize', () => this.init())
    return this
  },
  /*
  Disable plugin
  */
  disable () {
    this.elReset()
    window.removeEventListener('o-scroll', this.onScrollBound, false)
  },
  /**
   * Set element position to fixed state on page
   */
  elFix (offset_parent_bounds) {
    if (this.last_state === 'fixed') return
    this.last_state = 'fixed'
    this.applyStyles({
      position: 'fixed',
      left: offset_parent_bounds.left + this.config.original.left + 'px',
      top: this.config.spacing.top + 'px'
    })
    .classList.add('-stuck')
  },
  /*
    Leave element at the maximum top position based dictated the end element
  */
  elLeaveBehind (offset_parent_top, end_el_top, el_height) {
    if (this.last_state === 'abs') return
    this.last_state = 'abs'
    let top = end_el_top - el_height - offset_parent_top - this.config.spacing.bottom
    this.applyStyles({left: '', position: 'absolute', top: top + 'px'})
    .classList.add('-stuck')
  },
  /*
    Reset element to its original state
  */
  elReset () {
    if (this.last_state === null) return
    this.last_state = null
    this
    .applyStyles({left: '', position: '', top: ''})
    .classList.remove('-stuck')
  },
  /*
    Initialize listeners and element distances and
    trigger scroll
  */
  init () {
    if (!this.$el || !this.$end_el) return
    if (!window.matchMedia(this.config.mq).matches) {
      return this.disable()
    }
    this.elReset()
    window.removeEventListener('o-scroll', this.onScrollBound, false)
    window.addEventListener('o-scroll', this.onScrollBound, false)
    // trigger once on page load, on resize or on ad load
    this.onScroll()
  },
  initOffsetParentAndOriginalPosition (el_bounds, offset_parent_bounds) {
    this.$offset_parent = this.$el.offsetParent
    this.height = el_bounds.height
    this.config.original = {
      left: el_bounds.left - offset_parent_bounds.left,
      top: el_bounds.top - offset_parent_bounds.top
    }
    return el_bounds
  },
  onScroll () {
    let $offset_parent = this.$el.offsetParent || this.$offset_parent
    let el_bounds
    let offset_parent_bounds
    if (!$offset_parent) {
      return
    } else {
      el_bounds = this.bounds(this.$el)
      offset_parent_bounds = this.bounds($offset_parent)
      if (!this.config.original && $offset_parent) {
        this.initOffsetParentAndOriginalPosition(el_bounds, offset_parent_bounds)
      }
    }
    let end_el_bounds = this.bounds(this.$end_el)
    let delta_original_y =
      offset_parent_bounds.top +
      this.config.original.top
    let bottom_edge = el_bounds.height + this.config.spacing.top - this.config.spacing.bottom
    if (
      delta_original_y - this.config.spacing.top < 0 &&
      end_el_bounds.top >= bottom_edge
    ) {
      this.elFix(offset_parent_bounds, el_bounds)
    } else if (end_el_bounds.top < bottom_edge) {
      this.elLeaveBehind(offset_parent_bounds.top, end_el_bounds.top, el_bounds.height)
    } else {
      this.elReset()
    }
  },
  pageScroll () {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    }
  }
})
