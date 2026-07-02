const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// REEMPLAZA LO QUE ESTÁ ENTRE LAS COMILLAS CON TUS LLAVES DE DISCORD:
const CLIENT_ID = '1522137380981833738'; 
const CLIENT_SECRET = 'e_OeFw78BfxifeN8KiDZvK_rlrB-iuYT';
const REDIRECT_URI = 'https://brutalrp.onrender.com/callback';

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

        const usuario = userResponse.data;

        res.send('<div style="background:#000; color:#fff; font-family:sans-serif; height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center;"><h1 style="color:#ff0000;">¡SESIÓN INICIADA!</h1><p>Bienvenido a Brutal RP</p><a href="/" style="color:#fff; margin-top:20px; background:#ff0000; padding:10px 20px; text-decoration:none; border-radius:5px;">Volver</a></div>');
    } catch (error) {
        res.send('Error al conectar con Discord.');
    }
});

app.listen(PORT, () => {
    console.log('¡Servidor listo y corriendo en https://brutalrp.onrender.com/callback');
});