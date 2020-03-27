process.env.PORT = process.env.PORT || 3000;

////////////////////

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if(process.env.NODE_ENV === 'dev') process.env.URLDB = 'mongodb://localhost:27017/cafe'
else process.env.URLDB = process.env.mongo_url

// se ingresa el siguiente comando en la terminal para configurar la variable de ambiente
// heroku config:set mongo_url="XXXXXXX"
// heroku config para ver las variables configuradas


/////////////////////////////////
// CONFIGURACIÓN DEL JWT
/////////////////////

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

// SEED de autenticación
process.env.SEED = process.env.SEED || 'secretDev'

/////////////////////////////////

////////////////////////////////
// CONFIGURACIÓN DE GOOGLE
process.env.CLIENT_ID = process.env.CLIENT_ID || '96773221922-hc84ob3u08rgs8rpjs6k8rrla9bdhlq3.apps.googleusercontent.com'

/////////////////////