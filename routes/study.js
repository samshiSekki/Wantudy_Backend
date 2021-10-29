const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController')

router.get('/application', Application.createApplication)
router.post('/application', ApplicationController.saveApplication)


module.exports = router;