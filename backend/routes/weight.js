const express = require('express');
const weightController = require('../controllers/weightController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, weightController.recordWeight);
router.get('/history', authenticateToken, weightController.getWeightHistory);
router.get('/stats', authenticateToken, weightController.getWeightStats);

module.exports = router;
