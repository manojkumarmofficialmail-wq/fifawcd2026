const router = require('express').Router();
const { listTeams } = require('../controllers/teamsController');

router.get('/', listTeams);

module.exports = router;
