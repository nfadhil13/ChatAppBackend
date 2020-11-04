const express = require('express');
const app = express();
const mongo = require('./util/database');
const bodyParser = require('body-parser');
const roomRoutes = require('./routes/room');

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use('/room' , roomRoutes);

app.use((err , req , res ,next) => {
    const message = err.message || 'Unknown'
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message,
        statusCode
    })
})

const init = async () => {
    try{
        await mongo.connect();
        const server = app.listen(process.env.PORT || 3000);
        require('./socket').init(server);
    }catch(err){
        console.log(err);
    }
}

init();