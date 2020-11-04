const io = require('../socket');

const Room = require('../model/room')

const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');


exports.newRoom = async (req , res ,next) => {
    try{
        const username = req.body.username;
        
        /*This username array will be filled with the creator , because the creator is the first 
            Who made this room
        */
       const userId = uuidv4();
        const userArray = [{
            username,
            id : userId
        }]

        //This will be empty array , cause no one chatting yet
        const chatEmptyArray = []

        const newRoom = new Room({
            chats : chatEmptyArray,
            users : userArray
        })
        const result = await newRoom.save()


        res.status(201).json({
            message : 'success create room',
            data : {
                roomId : result._id,
                userId 
            }
        })
    }catch(err){
        next(err)
    }
}

exports.newMessage = async (req , res ,next) => {
    try{
        const userId = req.body.userId;
        const message  = req.body.message;
        const roomId = req.body.roomId;

        console.log(roomId);


        const room = await Room.findById(roomId);

        if(!room){
            const error = new Error('Room is not exist');
            error.statusCode = 404;
            throw error;
        }

        const user  = room.users.find((user)=> {
            console.log(userId)
            console.log(user)
            return user.id  === userId
        })

        if(!user){
            const error = new Error('This user isnt included in this chat');
            error.statusCode = 404;
            throw error;
        }

        const newChat ={
            id : uuidv4(),
            user,
            message,
            time : new Date()
        }

        room.chats.push(newChat)

        await room.save();

        console.log(newChat);
        io.getIO().to(roomId).emit('newchat',{
            data : newChat
        })

        res.status(201).send({
            messasge : 'Messsage sent',
            data   : newChat
        })

    }catch(err){
        if(err instanceof mongoose.Error.CastError){
            const error = new Error('Invalid Room ID code');
            error.statusCode = 422;
            next(error)
        }else{
            next(err)
        }
    }
}

exports.joinRoom = async (req , res ,next) => {
    try{
        const username = req.body.username;
        const roomId = req.body.roomId;

        
        const room = await Room.findById(roomId);



        if(!room){
            const error = new Error('Room is not exist');
            error.statusCode = 404;
            throw error;
        }

        const user = {
            username,
            id : uuidv4()
        }


        room.users.push(user)

        await room.save();

        io.getIO().to(roomId).emit('newuser',{
            data : username
        })
        console.log(room);
        res.status(201).send({
            message : 'Success Join',
            data : {
                user,
                roomId
            }
        })

    }catch(err){
        if(err instanceof mongoose.Error.CastError){
            const error = new Error('Invalid Room ID code');
            error.statusCode = 422;
            next(error)
        }else{
            next(err)
        }
    }
}

exports.isRoomExist =  async (req , res ,next) => {
    try{
        const roomId = req.params.roomId



        const room = await Room.findById(roomId);

        if(!room){
            const error = new Error('Room is not exist');
            error.statusCode = 404;
            throw error;
        }

        res.status(201).send({
            message : 'Room is Exist',
            data : {
                isRoomExist : true,
                room
            }
        })

    }catch(err){
        if(err instanceof mongoose.Error.CastError){
            const error = new Error('Invalid Room ID code');
            error.statusCode = 422;
            next(error)
        }else{
            next(err)
        }
    }
}

exports.isUserInRoom = async (req , res ,next) => {
    try{
        const userId = req.body.userId;
        const roomId = req.body.roomId;



        const room = await Room.findById(roomId);

        if(!room){
            const error = new Error('Room is not exist');
            error.statusCode = 404;
            throw error;
        }

        const user  = room.users.find((user)=> {
            console.log(userId)
            console.log(user)
            return user.id  === userId
        })

        if(!user){
            const error = new Error('This user isnt included in this chat room');
            error.statusCode = 404;
            throw error;
        }

        res.status(201).send({
            messasge : 'User is in room',
            data   : {
                isUserInRoom : true,
                user
            }
        })

    }catch(err){
        if(err instanceof mongoose.Error.CastError){
            const error = new Error('Invalid Room ID code');
            error.statusCode = 422;
            next(error)
        }else{
            next(err)
        }
    }
}