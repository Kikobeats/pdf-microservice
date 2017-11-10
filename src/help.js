'use strict'

module.exports = {
  url: '<required> URL to generate PDF',
  scale: '[default=1] Scale of the webpage rendering.',
  page_ranges: 'Paper ranges to print. E.g: 1-5, 8, 11-13.',
  landscape: '[default=false] Paper orientation.',
  format: '[default=A4] Paper format.',
  media: '[default=screen] Changes the CSS media type of the page.',
  message:
    'Welcome to pdf microservice. The following options are allowed as query parameters'
}
