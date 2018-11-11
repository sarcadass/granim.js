## 2.0.0

### Features

- Add custom direction ([rhanb](https://github.com/rhanb))
- Add support for other color types: `rgb`, `rgba`, `hsl`, `hsla`
- Add custom color positions

### Improvements

- Add `image.strecthMode` property `'none'` to allow `strecthMode` on only one axis
- Add ESLint for better code consistency
- Add tests and doc updates for all the new feature

### Miscellaneous

- Update local server config to latest Hapi version
- Add multiple API versions page


## 1.1.1

### Miscellaneous

- Update dependencies
- Update gulpfile with latest gulp version
- Update node versions on for Travis CI tests


## 1.1.0

### Features

- Add **blending mode** with image and image position handling
- Add **scrollDebounceThreshold** option
- Add **changeDirection** method
- Add **changeBlendingMode** method
- Add **destroy** method (fix #34)

### Improvements

- Refactor and optimisations
- Add tests
- Doc addition and improvements


## 1.0.6 (from 1.0.0)

### Bug Fixes

- Fix animation resuming when paused manually then canvas back in view if `isPausedWhenNotInView=true`
- Fix animation not starting at init when `isPausedWhenNotInView=true` and canvas is in view

### Features

- Add **Radial gradients**

### Improvements

- Reduce CPU footprint for Chrome
- Add option to change default state name
- Add Karma / Jasmine tests ([pranaygp](https://github.com/pranaygp))
- Add Code coverage ([pranaygp](https://github.com/pranaygp))
- Can set HTMLCanvasElement directly instead of CSS selector ([suhaotian](https://github.com/suhaotian))

### Miscellaneous

- Add to NPM and Bower registry
- Add `CONTRIBUTING.md` ([pranaygp](https://github.com/pranaygp))
- Add `CHANGELOG.md`
- Updated `README.md`
- Docs fixes and improvements ([howdy39](https://github.com/howdy39), [M-arcus](https://github.com/M-arcus) and [YLiohenki](https://github.com/YLiohenki))
- Create a Gitter Channel
