const express = require('express')
const request = require('request')
const app = express()
const fs = require('fs');
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

app.use(express.json({extended: true, limit: '1mb'}))

app.all('/', (req, res) => {
console.log("Just got a request!")
res.send('Yo!')
})

app.get('/gpt/:text', async (req, res) => {
const text = req.params.text
const { Configuration, OpenAIApi } = require("openai");

console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt ="\nQ:" + text + "\nA:";
console.log(prompt);

const response = await openai.createChatCompletion({
model: "gpt-3.5-turbo",
messages: [{role: "system", content: "You are a chatbot on the twitch platform, so you should follow the twitch rules.You must answer quickly and briefly in Russian.Be polite and funny to everyone.You have to talk like a human, like you have an opinion.You are a man."},
{ role: "user", content: prompt}],
temperature: 0.5,
max_tokens: 300,
top_p: 1,
frequency_penalty: 0,
presence_penalty: 0,
});
if (response.data.choices) {
res.send(response.data.choices[0].message.content)
} else {
res.send("Something went wrong. Try again later!")
}
})

app.listen(process.env.PORT || 3000)
