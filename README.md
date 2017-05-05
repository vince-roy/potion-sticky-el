# Potion Sticky Element
A Modern Vanilla Sticky Element

## Initializing
```js 
  import StickyEl from 'potion-sticky-el'

  const ad_sticky = 
    StickyEl(
      '.js-sticky-el', 
      '.js-sticky-end', 
      {
        mq: '(min-width: 768px)', // optional mq that defaults to (min-width: 768px)
        spacing: {
          bottom: 0, // spacing between js-sticky-end and js-sticky-el when the sticky el exits 'sticky' mode
          top: 0 // top spacing when in 'sticky' mode
        }
      }
    )
```
