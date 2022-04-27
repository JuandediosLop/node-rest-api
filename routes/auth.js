const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//REGISTER
router.post('/register', async (req, res) => {
    try {
        //generar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //crear un nuevo usuario
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //guardar el usuario y responder
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    try {
        //buscar el usuario
        const user = await User.findOne({email: req.body.email});
        //comprobar si existe
        !user && res.status(404).json('User not found');

        //comprobar la contraseña
        const validPass = await bcrypt.compare(req.body.password, user.password);
        !validPass && res.status(400).json('Invalid password');

        //responder
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;