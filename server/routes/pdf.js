const router = require('express').Router();
const { dailyReport } = require('../controllers/pdfController');

router.get('/daily-report', dailyReport);

module.exports = router;
