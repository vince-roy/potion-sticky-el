export default ($el, $wrap_el, opts) => ({
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
    if (!$el || !$wrap_el) return
    Object.assign(this, {
      $el,
      $wrap_el
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
  elFix (wrap_bounds) {
    if (this.last_state === 'fixed') return
    this.last_state = 'fixed'
    this.applyStyles({
      bottom: '',
      position: 'fixed',
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
    this.applyStyles({left: '', position: 'absolute', bottom: this.config.spacing.bottom + 'px', top: 'auto'})
    .classList.add('-stuck')
  },
  /*
    Reset element to its original state
  */
  elReset () {
    if (this.last_state === null) return
    this.last_state = null
    this
    .applyStyles({bottom: '', left: '', position: '', top: ''})
    .classList.remove('-stuck')
  },
  /*
    Initialize listeners and element distances and
    trigger scroll
  */
  init () {
    if (!this.$el || !this.$wrap_el) return
    if (!window.matchMedia(this.config.mq).matches) {
      return this.disable()
    }
    this.elReset()
    window.removeEventListener('o-scroll', this.onScrollBound, false)
    window.addEventListener('o-scroll', this.onScrollBound, false)
    // trigger once on page load, on resize or on ad load
    this.onScroll()
  },
  initOffsetParentAndOriginalPosition (el_bounds, wrap_bounds) {
    this.config.original = {
      left: el_bounds.left - wrap_bounds.left,
      top: el_bounds.top - wrap_bounds.top
    }
    return el_bounds
  },
  onScroll () {
    let el_bounds = this.bounds(this.$el)
    let wrap_bounds = this.bounds(this.$wrap_el)
    if (!this.config.original) {
      this.initOffsetParentAndOriginalPosition(el_bounds, wrap_bounds)
    }
    if (
      wrap_bounds.top - this.config.original.top - this.config.spacing.top <= 0 &&
      wrap_bounds.bottom > this.config.spacing.top + this.config.spacing.bottom + el_bounds.height
    ) {
      this.elFix(wrap_bounds, el_bounds)
    } else if (wrap_bounds.bottom <= this.config.spacing.top + this.config.spacing.bottom + el_bounds.height) {
      this.elLeaveBehind(wrap_bounds)
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
