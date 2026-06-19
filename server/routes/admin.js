const router = require('express').Router();
const requireAdmin = require('../middleware/auth');
const {
  login,
  getSettings,
  setTime,
  setVisibility,
  eliminateTeam,
  listUsers,
} = require('../controllers/adminController');
const { replaceEmployees } = require('../controllers/employeesController');

// Every admin route requires the shared key header.
router.use(requireAdmin);

router.post('/login', login);
router.get('/settings', getSettings);
router.post('/set-time', setTime);
router.post('/visibility', setVisibility);
router.post('/employees', replaceEmployees);
router.post('/eliminate-team', eliminateTeam);
router.get('/users', listUsers);

module.exports = router;
