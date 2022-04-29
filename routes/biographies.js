const express = require('express')
const { redirect } = require('express/lib/response')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Biography = require('../models/Biography')

//desc login Show Add page
//route Get /biographies/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('biographies/add')

})

//desc login Show Add page
//route Get /biographies/add
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user =req.user.id
        await Biography.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//desc login Show Biographies
//route Get /biographies/add
router.get('/', ensureAuth, async (req, res) => {

    try {
        const biographies = await Biography
        .find({status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean()

        res.render('biographies/index', {
            biographies,
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//show one biography
//route Get /biographies/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let biography = await Biography.findById(req.params.id)
        .populate('user')
        .lean()

        if (!biography) {
            return res.render('error/404')
        }

        res.render('biographies/show', {biography
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
  
    }

})


//desc login Show Edit page
//route Get /biographies/edit/:id
router.get('/edit/:id', ensureAuth, async(req, res) => {

    try {
        const biography = await Biography.findOne({
            _id: req.params.id
        }).lean()
    
        if (!biography) {
            return res.render('error/404')
        }
    
        if(biography.user !=req.user.id) {
            res.redirect('/biographies')
        } else {
            res.render('biographies/edit', { biography, })
        }
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }

   
})

//desc Update biography
//route Put /biographies/edit/:id
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        
        let biography = await Biography.findById(req.params.id).lean()
        if (!biography) {
            return res.render('error/404')
        }
        
        if(biography.user !=req.user.id) {
            res.redirect('/biographies')
        } else {
            biography = await Biography.findOneAndUpdate( {_id: req.params.id}, req.body, {
                new: true, runValidators: true,
            })
            res.redirect('/dashboard')
        }
    
    } catch (error) {
        console.error(err)
        return res.render('error/500')
    }
       
})

//desc Delete story
//route Get /biographies/add
router.delete('/:id', ensureAuth, async (req, res) => {
   try {
       await Biography.remove({ _id: req.params.id})
       res.redirect('/dashboard')
   } catch (error) {
       console.error(err)
       return res.render('error/500')
   }

})



//desc User Biographies
//route Get /biographies/user/userid
router.get('/user/:userId', ensureAuth, async(req, res) => {
   try {
       const biographies = await Biography.find({
           user: req.params.userId,
           status: 'public'
       })
       .populate('user')
       .lean()

       res.render('biographies/index', {
           biographies
       })
   } catch (error) {
       console.error(err)
       res.render('error/500')
   }

})
module.exports = router