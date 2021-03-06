const express = require('express')
const passport = require('passport')
const router = express.Router()

//desc login or landing page
//@route Get /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc Google auth callback
//@route Get /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), 
(req, res) => {
    res.redirect('/dashboard')
})


//@desc Logout for user
//@route /auth/logout

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router