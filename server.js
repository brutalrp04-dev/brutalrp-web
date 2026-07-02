const express = require('express');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

const CLIENT_ID = '1522137380981833738'; 
const CLIENT_SECRET = 'e_OeFw78BfxifeN8KiDZvK_rlrB-iuYT';
const REDIRECT_URI = 'https://brutalrp.onrender.com/callback';

app.use(session({
    secret: 'brutalrp_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
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

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: 'Bearer ' + tokenResponse.data.access_token }
        });

        // Guardamos en la sesión oficial
        req.session.user = userResponse.data;
        res.redirect('/dashboard.html');
    } catch (error) {
        res.send('Error al conectar con Discord.');
    }
});

app.listen(PORT, () => console.log('Servidor activo.'));