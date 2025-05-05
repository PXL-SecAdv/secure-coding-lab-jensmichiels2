const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt'); // bcrypt toegevoegd
require('dotenv').config();

const port = process.env.PORT || 3000;

const pool = new pg.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    connectionTimeoutMillis: 5000
});

console.log("Connecting...");

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/authenticate/:username/:password', async (request, response) => {
    const username = request.params.username;
    const password = request.params.password;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE user_name = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return response.status(401).json({ error: 'Gebruiker niet gevonden' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return response.status(401).json({ error: 'Ongeldig wachtwoord' });
        }

        response.status(200).json({
            message: 'Succesvol ingelogd',
            user: { id: user.id, username: user.user_name }
        });

    } catch (error) {
        console.error('Database error:', error);
        response.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
