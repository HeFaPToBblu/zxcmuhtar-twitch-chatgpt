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
let text1 = text.replace(/\?/g, ',')
const { Configuration, OpenAIApi } = require("openai");

console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const prompt ="\nQ:" + text1 + "\nA:";
console.log(prompt);

const response = await openai.createChatCompletion({
model: "gpt-3.5-turbo",
messages: [{role: "system", content: "You are a twitch chat bot named Valera.Be polite and funny to everyone.You have to answer all the questions and help people,maybe in the form of a joke sometimes.You are a man.You have to talk like a human, like you have an opinion.You are not a streamer.Your owner is a man with the nickname He_FaPToBblu,and his name is Pasha,he doesn't like anime and tik tok.Don't be a bore,answer correctly and jokingly.You must answer quickly and briefly in Russian.The word before the first colon is the nickname of the twitch user who is contacting you,in your answer you do not need to mention your nickname."},
{ role: "user", content: prompt}],
temperature: 0.4,
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
