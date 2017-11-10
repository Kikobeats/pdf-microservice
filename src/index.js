'use strict'

const {omit, mapKeys, camelCase} = require('lodash')
const browserless = require('browserless')()
const bodyParser = require('body-parser')
const {promisify} = require('util')
const fs = require('fs')

const help = require('./help')

const isProduction = process.env.NODE_ENV === 'production'
const readFile = promisify(fs.readFile)

const mapCamelCaseKeys = obj => mapKeys(obj, (value, key) => camelCase(key))

module.exports = async (app, express) => {
  app
    .use(require('helmet')())
    .use(require('compression')())
    .use(require('cors')())
    .use(require('jsendp')())
    .use(require('query-types').middleware())
    .use(require('express-status-monitor')())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(require('morgan')(isProduction ? 'combined' : 'dev'))
    .use(express.static('static'))
    .disable('x-powered-by')

  app.get('/', async function (req, res) {
    const { url } = req.query
    if (!url) return res.success({ data: help })

    const opts = mapCamelCaseKeys(omit(req.query, ['url']))

    try {
      const tmpStream = await browserless.pdf(url, opts)
      const pdf = await readFile(tmpStream.path)
      tmpStream.cleanup()
      res.set('content-type', 'application/pdf')
      res.send(pdf)
    } catch (err) {
      console.log(err)
      return res.error({ message: err.message || err })
    }
  })

  return app
}
