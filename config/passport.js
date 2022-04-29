const { connect } = require('../routes')

const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require ('mongoose')
const User = require('../models/User')
const { deleteOne } = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'

    }, async (accessToken, refreshToken, profile, perfect) => {
        const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }
        try{
            let user = await User.findOne({googleId: profile.id})
            
            if (user) {
                perfect(null, user)
            } else {
                user = await User.create(newUser)
                perfect(null, user)
            }
        }catch (err) {
            console.error(err)
        
        }
    }
    ))

//work on this?
passport.serializeUser((user, cb) => {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.displayName });
    });
  });
  
  passport.deserializeUser((user, cb) => {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

      //work on the above?
}
