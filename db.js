// Crear conexión usando solo variables de entorno
const con = mysql.createConnection({
    host: process.env.DB_HOST,       // Por ejemplo, Railway te dará algo como containers-us-west-1.railway.app
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Conectar y manejar error
con.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Exportar la conexión usando promesas
module.exports = con.promise();