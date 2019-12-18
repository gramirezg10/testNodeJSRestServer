process.env.PORT = process.env.PORT || 3000;

////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if(process.env.NODE_ENV === 'dev') process.env.URLDB = 'mongodb://localhost:27017/cafe'
else process.env.URLDB = process.env.mongo_url