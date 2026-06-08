const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, profileController.getProfile);
router.post('/', authenticateToken, profileController.createOrUpdateProfile);

module.exports = router;
