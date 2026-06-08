const express = require('express');
const planController = require('../controllers/planController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', authenticateToken, planController.generatePlan);
router.get('/history', authenticateToken, planController.getPlanHistory);

module.exports = router;
