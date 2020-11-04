const express = require('express');

const router = express.Router();

const roomController = require('../controller/room');


router.post('/new', roomController.newRoom);

router.post('/newmessage' , roomController.newMessage);

router.post('/join' , roomController.joinRoom);

router.get('/checkroom/:roomId' , roomController.isRoomExist);

router.post('/isuserinroom' , roomController.isUserInRoom);
     
module.exports = router