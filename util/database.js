const mongoose = require('mongoose');

exports.connect = async () => {
    try{
        const uri = 'mongodb+srv://api_access:1nuOaCpRCUmrzTNG@cluster0.ye2j3.mongodb.net/chatapp?retryWrites=true&w=majority'
        await mongoose.connect(uri , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('success connect to mongo')
    }catch(err){
        throw err
    }
}
