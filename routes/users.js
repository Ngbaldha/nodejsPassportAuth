const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
//User model
const User = require('../models/User');
//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//Register Handle

router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    if (!name || !email || !password || !password2){
        errors.push({msg : 'Please fill all fields'});
    }

    if (password != password2){
        errors.push({msg : 'Passwords do not match'});
    }

    if (password.length < 6){
        errors.push({msg : 'Password should be atleast 6 charachters'});
    }
    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password2,
            password
        });
    } else {
        //Validation passed
        User.findOne({email: email})
            .then(user => {
                console.log(user);
                if(user){
                    errors.push({msg: "Email is already registered"});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password2,
                        password
                    });
                } else {
                    const newUser = new User({
                        name, email, password
                    });

                    //hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash)=> {
                        if(err) throw err;

                        newUser.password = hash;

                        //Save the user
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg','You are now registered');
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err));
                    }));
                }
            });
    }
});

module.exports = router;