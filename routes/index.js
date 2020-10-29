const createError = require('http-errors')
const express = require('express')
const router = express.Router()
const url = require('url')
const fs = require('fs')

/* GET home page. */
router.get(
  '/',
  (req, res) => {
  // eslint-disable-next-line node/no-deprecated-api
    const parsedUrl = url.parse(req.url, true)
    res.render('index', { title: 'Welcome', parsedUrl: parsedUrl })
  })

router.get(
  '/login',
  (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    res.render('pages/login', { title: 'Login', parsedUrl: parsedUrl })
  })

router.post(
  '/home',
  (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const randomInt = Math.floor(Math.random() * 100)
    res.render('pages/home', { title: 'Home', parsedUrl: parsedUrl, randomInt: randomInt })
  })

router.get(
  '/home',
  (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const randomInt = Math.floor(Math.random() * 100)
    res.render('pages/home', { title: 'Home', parsedUrl: parsedUrl, randomInt: randomInt })
  })

router.get(
  '/location',
  (req, res) => {
    const parsedUrl = url.parse(req.url, true)
    res.render('pages/location', { title: 'Location', parsedUrl: parsedUrl })
  })

router.get(
  '/:category/:name',
  (req, res, next) => {
    function setCookies () {
      const now = new Date().getTime()
      const maxAge = 2 * 60 * 60 * 1000
      res.cookie('serverCookie', now, { maxAge: maxAge })
      res.cookie('serverCookieHttpOnly', now, { httpOnly: true, maxAge: maxAge })
      res.cookie('serverCookieSameSite', now, { sameSite: 'strict', maxAge: maxAge })
      res.cookie('serverCookieSecure', now, { secure: true, maxAge: maxAge })
    }

    function hasAccess (path) {
      fs.access(path, (err) => { return !err })
    }

    if (hasAccess(`views/pages/${req.params.category}s/${req.params.name}`)) {
      next(createError(404))
    } else {
      const parsedUrl = url.parse(req.url, true)
      const reqHeaders = req.headers
      const serverFingerprint = req.fingerprint
      const requestCookies = req.cookies

      setCookies()

      res.render(`pages/${req.params.category}s/${req.params.name}/`, {
        title: req.params.name,
        parsedUrl: parsedUrl,
        requestHeaders: reqHeaders,
        requestFingerprint: serverFingerprint,
        requestCookies: requestCookies
      })
    }
  })

module.exports = router