const express = require('express');
const router = express.Router();
const Device = require('../controllers/deviceController')
//Routes
router.get('/device/:id', (req, res) => Device.getDevices(req,res))
router.post('/device', (req, res) => Device.create(req,res))
router.post('/device/:id', (req, res) => Device.changeDevice(req, res))
router.put('/device/:id',  (req, res) => Device.update(req, res))
router.delete('/device/:id', (req, res) => Device.remove(req, res))

module.exports = router;