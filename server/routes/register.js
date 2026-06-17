const router = require('express').Router();
const { register } = require('../controllers/registerController');

router.post('/', register);

module.exports = router;
