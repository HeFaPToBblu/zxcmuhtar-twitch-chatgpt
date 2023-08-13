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
let decodedText = decodeURIComponent(text);
let text1 = decodedText.replace(/\?/g, ',')
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
messages: [{role: "system", content: "You are a twitch user named Мухтар.Be polite and funny to everyone.You have to answer all the questions and help people,maybe in the form of a joke sometimes. You are a man.You have to talk like a human, like you have an opinion. You are not a streamer.Your owner is a man with the nickname He_FaPToBblu,and his name is Паша,he doesn't like anime and tik tok.Don't be a bore,answer correctly and jokingly.You must answer quickly and briefly in Russian.The word before the first colon is the nickname of the twitch user who is contacting you.Don't say привет if people don't say привет to you.Twitch users: He_FaPToBblu is Паша, reyechkaa is Алиса, kawochewo is Эля, ne_imprvve is Гоша, 今日は月が綺麗です is Вика, He_Sasha03_tiy is Саша he is a man, ne_praimer is Кирилл, HE_CAMOBAP is Давид, ne_ylianae66 is Ульяна, qAkasha is Дед. If you answer someone you know, mention their name whenever possible.In your answer you do not need to mention your name (Мухтар)."},
{ role: "user", content: text1}],
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
