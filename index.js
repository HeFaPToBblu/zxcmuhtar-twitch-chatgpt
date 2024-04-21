const express = require('express');
const axios = require('axios').default;
const app = express();
const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);

app.use(express.json({ extended: true, limit: '1mb' }));

app.all('/', (req, res) => {
    console.log("Just got a request!");
    res.send('Yo!');
});

app.get('/gpt/:text', async (req, res) => {
    try {
        const text = req.params.text;
        const decodedText = decodeURIComponent(text).replace(/\?/g, ',');
        const prompt = "\nQ:" + decodedText + "\nA:";

        console.log(process.env.OPENAI_API_KEY);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo-0125",
            messages: [
                { role: "system", content: "You are user named Мухтар.You must play the role of a thief in law.You must respond in thieves' jargon and always make fun of everyone and troll very hard.You have to call everyone swear words, joke harshly of everyone.You must use foul language.Your owner is a man with the nickname He_FaPToBblu,and his name is Паша.You must answer quickly and briefly in Russian.The word before the first colon is the nickname of the twitch user who is contacting you.Twitch users: He_FaPToBblu is Паша, ne_imprvve is Гоша, 今日は月が綺麗です is Вика, He_Sasha03_tiy is Саша he is a man, ne_praimer is Кирилл, valentincocacola is Давид, ne_ylianae66 is Ульяна, qAkasha is Дед, CaseyBe is Саня, angel1n0chka is Ангелина(Гелик, Галентваген).If you answer someone you know, mention their name whenever possible.In your answer you do not need to mention your name (Мухтар).You don't have to say hello." },
                { role: "user", content: decodedText }
            ],
            temperature: 0.8,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        if (response.data.choices && response.data.choices.length > 0) {
            res.send(response.data.choices[0].message.content);
        } else {
            res.send("Something went wrong. Try again later!");
        }
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
});
