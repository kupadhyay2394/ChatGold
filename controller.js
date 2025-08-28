const express = require('express');
const dotenv= require('dotenv');
const fetch= require('node-fetch');

const OpenAI = require('openai');

dotenv.config();

const app = express();
app.use(express.json());



const client = new OpenAI({
  apiKey: process.env.SAMBANOVA_API_KEY,  
  baseURL: "https://api.sambanova.ai/v1",
});


let chatHistory = [];

const axios = require("axios");







async function getGoldArticles() {
  try {
    var intention=0;
    const res = await axios.post("https://eventregistry.org/api/v1/article/getArticles", {
      query: {
        $query: {
          keyword: "gold investment",
          keywordLoc: "title,body"
        },
        $filter: {
          forceMaxDataTimeWindow: "31"
        }
      },
      resultType: "articles",
      articlesSortBy: "date",
      articlesCount: 3,
      includeArticleBody: true,
      includeArticleSummary: true,
      apiKey: "b78b78f8-3d32-4ab1-a400-3c2b6f1e37a5"
    });

    if (res.data && res.data.articles && res.data.articles.results) {
      return res.data.articles.results.map(article => ({
        title: article.title,
        content: article.body || article.summary || "no content"
      }));
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error fetching articles:", err.response?.data || err.message);
    return [];
  }
}









async function getGoldPrice() {
  try {
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=cfe8782b1f49c80041e93d257117e577&base=USD&currencies=XAU`;
    const res = await fetch(url);
    const data = await res.json();
    return data.rates?.XAU?.toFixed(2) || "unavailable";
  } catch (err) {
    return "unavailable";
  }
}

const getreply = async (req, res) => {
  try {
    var intention=0;
    console.log("got call");

    const { query } = req.body;
    chatHistory.push({ role: "user", content: query });

    const systemPrompt = `You are a helpful financial assistant. 
Use ReAct reasoning. 
If user input needs gold price, respond with: Action: getGoldPrice().
If user input needs gold news or trends, respond with: Action: getGoldNews().
If user input show intrest in buying gold: Action: buyGold().

Always wait for Observation before giving the final answer.
Do not hallucinate actions not defined.`;

    let messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
    ];

    let finalOutput = "";

    const response = await client.chat.completions.create({
      model: "DeepSeek-V3-0324",
      messages,
      temperature: 0.1,
      top_p: 0.9,
    });

    const output = response.choices[0].message.content;
    console.log(output);

    if (output.includes("Action: getGoldPrice()")) {
      const price = await getGoldPrice();
      //messages.push({ role: "system", content: `Observation: Current gold price is ${price} USD/ounce.` });

      // const finalResponse = await client.chat.completions.create({
      //   model: "DeepSeek-V3-0324",
      //   messages,
      //   temperature: 0.1,
      //   top_p: 0.9,
      // });
      finalOutput=`Observation: Current gold price is ${price} USD/ounce.` 

      //finalOutput = finalResponse.choices[0].message.content;
      chatHistory.push({ role: "assistant", content: finalOutput });

    }else if (output.includes("Action: buyGold()")) {
      const Response = await client.chat.completions.create({
        model: "DeepSeek-V3-0324",
        messages: [
          { role: "system", content: "sugget user to invest gold by clicking the button in the chat only" },
          { role: "user", content: query }
        ],
        temperature: 0.1,
      });
      finalOutput=Response.choices[0].message.content;
      chatHistory.push({ role: "assistant", content: Response.choices[0].message.content});
      intention=1;
      
      

    }  
    else if (output.includes("Action: getGoldNews()")) {
      const articles = await getGoldArticles();
      let articleTexts = articles.map((a, i) => `${i+1}. ${a.title}\n${a.content}`).join("\n\n");

      const summaryResponse = await client.chat.completions.create({
        model: "DeepSeek-V3-0324",
        messages: [
          { role: "system", content: "Summarize the following gold investment news into bullet points." },
          { role: "user", content: articleTexts }
        ],
        temperature: 0.1,
      });


      const summary = summaryResponse.choices[0].message.content;
      console.log('the summary is');
      
      const summaryResponse2 = await client.chat.completions.create({
        model: "DeepSeek-V3-0324",
        messages: [
          { role: "system", content: `Based on ${query} form response using ${summary}`},
          { role: "user", content: articleTexts }
        ],
        temperature: 0.1,
      });
      console.log(summaryResponse2.choices[0].message.content);
      
      
      
    
      
      finalOutput = summaryResponse.choices[0].message.content;
    
      chatHistory.push({ role: "assistant", content: finalOutput });

    } else {
      const promt = [
  { 
    role: "system", 
    content: `You are a helpful financial assistant. 
Only talk about **gold investment**. 
If the user asks anything outside gold investment, politely redirect them back to gold investment. 

Your answers must always be based on **digital gold investment** (such as online gold platforms, gold-backed investment apps, ETFs, sovereign gold bonds, and digital wallets for gold). 

Be clear, concise, and user-friendly.`
  },
  { 
    role: "user", 
    content: query 
  }
];


      const finalResponse = await client.chat.completions.create({
        model: "DeepSeek-V3-0324",
        messages: promt,
        temperature: 0.1,
        top_p: 0.9,
      });

      finalOutput = finalResponse.choices[0].message.content;
      chatHistory.push({ role: "assistant", content: finalOutput });
    }

    // Suggestions
    const suggestionResponse = await client.chat.completions.create({
      model: "DeepSeek-V3-0324",
      messages: [
        ...messages,
        { role: "system", content: `Now, based on the last answer, generate 3 follow-up questions about gold investment in JSON format.` }
      ],
      temperature: 0.1,
      top_p: 0.9,
    });

    const outputsuggestion = suggestionResponse.choices[0].message.content;

    res.json({
      answer: finalOutput,
      history: chatHistory,
      suggestion: outputsuggestion,
      intention
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getreply };