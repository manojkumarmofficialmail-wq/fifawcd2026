const router = require('express').Router();
const requireAdmin = require('../middleware/auth');
const {
  login,
  getSettings,
  setTime,
  eliminateTeam,
  listUsers,
} = require('../controllers/adminController');

// Every admin route requires the shared key header.
router.use(requireAdmin);

router.post('/login', login);
router.get('/settings', getSettings);
router.post('/set-time', setTime);
router.post('/eliminate-team', eliminateTeam);
router.get('/users', listUsers);

module.exports = router;
