const express = require('express')
const router = express.Router();
const {registerUser, loginUser} = require('../Controllers/User')
const verifyToken = require('../Middleware/Middleware')

router.route('/').get(verifyToken, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed' });
});

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)


module.exports = router;