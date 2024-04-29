const mongoDB = require('mongodb');
const MongoClient=mongoDB.MongoClient
const ObjectID=mongoDB.ObjectId

let database;

async function getDatabase(){
    const client=await MongoClient.connect('mongodb://127.0.0.1:27017')
    database=client.db('library')
    if(!database){
        console.log("database not connected");
    }
    return database

}

module.exports ={ 
    getDatabase,
    ObjectID
}

