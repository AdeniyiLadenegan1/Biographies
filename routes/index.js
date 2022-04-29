const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest} = require('../middleware/auth')

const Biography = require('../models/Biography')

//desc login or landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })

})
//@desc Dashboard
//@route Get/dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const biographies = await Biography.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            biographies
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

})

module.exports = router