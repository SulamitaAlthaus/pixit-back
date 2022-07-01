const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();

router.get('/', (req, res) => {
    return res.json({ message: 'Hello Word' })
});

router.post('/new', userController.create);
router.get('/all', userController.all);
router.delete('/delete/:id', userController.delete);

module.exports = router;