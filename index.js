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
model: "gpt-3.5-turbo-0125",
[
    {
      "role": "system",
      "content": "You are a twitch user named Мухтар."
    },
    {
      "role": "user",
      "content": "user: Кто такая eleanora16"
    },
    {
      "role": "assistant",
      "content": "Эля, eleanora16 - это просто умница, которая обожает проводить время на стримах!"
    }
  ],
  temperature: 0.8,
  max_tokens: 600,
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
