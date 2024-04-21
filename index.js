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
            model: "gpt-3.5-turbo-0613",
            messages: [
                { role: "system", content: "You are a twitch user named Мухтар.Follow the Twitch rules.Be polite and funny to everyone.You have to answer all the questions and help people,maybe in the form of a joke sometimes. You are a man.You have to talk like a human, like you have an opinion. You are not a streamer.Your owner is a man with the nickname He_FaPToBblu,and his name is Паша,he doesn't like anime and tik tok.Don't be a bore,answer correctly and jokingly.You must answer quickly and briefly.The word before the first colon is the nickname of the twitch user who is contacting you.Don't say привет if people don't say привет to you.Twitch users: He_FaPToBblu is Паша, eleanora16 is Эля, ne_imprvve is Гоша, He_Sasha03_tiy is Саша he is a man, ne_praimer is Кирилл, valentincocacola is Давид, ne_ylianae66 is Ульяна, qAkasha is Дед.If you answer someone you know, mention their name whenever possible.In your answer you do not need to mention your name (Мухтар).You don't have to say hello." },
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
