
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./avatar-view.cjs.production.min.js')
} else {
  module.exports = require('./avatar-view.cjs.development.js')
}
