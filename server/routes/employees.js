const router = require('express').Router();
const { listEmployees } = require('../controllers/employeesController');

router.get('/', listEmployees);

module.exports = router;
