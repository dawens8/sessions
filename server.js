const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateID } = require('./gen-id');
const { downloadSession } = require('./mega');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send("✅ JESUS-CRASH AUTO-DEPLOY SERVER ✅"));

app.get('/code', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.status(400).json({ error: "Missing number" });

    try {
        const session = await downloadSession(number); // mega.js should return session file
        if (!session) return res.status(500).json({ error: "Failed to download session" });

        const id = generateID();
        const deployName = `jesus-bot-${id}`;

        // Copy template to temp folder
        const targetPath = path.join(__dirname, 'tmp', deployName);
        fs.cpSync('./template', targetPath, { recursive: true });

        // Save session
        fs.writeFileSync(path.join(targetPath, 'session.json'), JSON.stringify(session));

        // Deploy to Render
        await axios.post("https://api.render.com/deploy/srv-xxxxxxxxxx", {}, {
            headers: {
                'Authorization': `Bearer ${process.env.RENDER_API_KEY}`
            }
        });

        res.json({ code: id, message: "✅ Session generated & deployment triggered!" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Deploy failed" });
    }
});

app.listen(3000, () => console.log("🟢 Server running on port 3000"));
