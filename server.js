const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// TUS CREDENCIALES
const CLIENT_ID = '1522137380981833738'; 
const CLIENT_SECRET = 'e_OeFw78BfxifeN8KiDZvK_rlrB-iuYT';
const REDIRECT_URI = 'https://brutalrp.onrender.com/callback';

// Variable para guardar el usuario temporalmente
let usuarioConectado = null;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para que el dashboard consulte quién es el usuario
app.get('/api/user', (req, res) => {
    if (usuarioConectado) {
        res.json({ loggedIn: true, user: usuarioConectado });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send('Fallo la autenticación.');

    try {
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: 'Bearer ' + accessToken }
        });

        // Guardamos el usuario para enviarlo al dashboard
        usuarioConectado = userResponse.data;

        // Redirigimos al panel profesional
        res.redirect('/dashboard.html');

    } catch (error) {
        console.error(error);
        res.send('Error al conectar con Discord.');
    }
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto ' + PORT);
});