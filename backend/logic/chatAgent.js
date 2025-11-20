import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from "@langchain/core/prompts"
import {Document} from "@langchain/core/documents"
import {MongoClient} from "mongodb"
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai"
// import {GoogleSerperAI} from "@langchain/community/"
import {Chroma} from "@langchain/community/vectorstores/chroma"
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import dotenv from "dotenv";
import axios from 'axios'
// import express from 'express'
import fs from 'fs'
///import path from "path";
// const app = express()

dotenv.config();


export async function chatAgent(userQuery) {

//url based serach query 
const queryUrl = `site:fln.org.in ${userQuery}`


//serper API wrapper initialisation
let serperData = JSON.stringify({
  "q": queryUrl,
  "location": "India",
  "gl": "in"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://google.serper.dev/search',
  headers: { 
    'X-API-KEY': process.env.SERPER_API_KEY, 
    'Content-Type': 'application/json'
  },
  data : serperData
};


let mainData
let urls
try {
  const response = await axios.request(config);
  //console.log(JSON.stringify(response.data.organic));
  mainData = response.data.organic
  //console.log(Array.isArray(mainData))
  urls = mainData?.map(url => url.link)
  urls = urls.filter((withoutPDF) => !withoutPDF.endsWith('.pdf'))
  urls = urls.slice(0, 1)
  console.log(urls)
  //console.log(urls)
  
  // Array.isArray(mainData).map((url) => {
  //   console.log(url.link)
  //   return url.link

  // })
;
  //return response.data;
  
}
catch (error) {
  console.log(error);
}

  console.log(Array.isArray(urls))

  //array of urls
  // let webResponseArray = []


  let webContent
  try{
    webContent = await Promise.all(
    urls.map(async  (url)  => {
      //console.log(url)
      if(typeof(url) === "string" && url.endsWith('.pdf')){
        console.error("PDF Error")
        return null
      }
      const loader = new CheerioWebBaseLoader(url, {
         selector:
        '.wp-block-group.hero-content, .wp-block-table, main.wp-block-group, .wp-block-post-title, .wp-block-group.entry-content, .wp-block-post-content, .entry-content, article',
    });

      const response = await loader.load()
      let pagetext = response[0].pageContent
      pagetext = pagetext.replace(/\r?\n|\r/g,  '').replace(/\t+/g, "").replace(/\s{2,}/g, "").trim().slice(0, 2000)
      console.log(pagetext)

      //console.log(response
      return pagetext


    })


  )
  fs.writeFileSync('textContent.txt', JSON.stringify(webContent), 'utf-8')
  console.log("File created")
  }
catch(err) {
    console.error("❌ Error loading:", urls, err.message);
    return null;

}




  //cherio loader
  //const loadedData = 
  //const loader = new CheerioWebBaseLoader()



console.log(queryUrl)

//mongodb connection
const connection  = new MongoClient(process.env.URI)
await connection.connect()

//db name
const db = connection.db("library_database")

//collection name
const collection = db.collection("libraries_data")

//search for documents
const data = await collection.find({}).toArray()

//langchain document loader
const docs = data.map((item) => (
new Document({
    pageContent : JSON.stringify(item, null, 2),
    metadata : {id : item.id, title : item.title}
})

))
//console.log(docs)

//embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_KEY,
  model: "text-embedding-004", // or any other supported model
});

//const result = await embeddings.embedDocuments(docs.map((doc)=> doc.pageContent))
//console.log(result)

//vector store and it creates embedding too
const vectorstore = await Chroma.fromDocuments(docs, embeddings, {
    collectionName : "libraries-data-vectorstore"
})

//result of the similarity search
const resultVec = await vectorstore.similaritySearch(userQuery, 4)
//console.log(resultVec)


//context contains RAG data and webDocs

 const context = resultVec + webContent


//Prompt template to instruct LLM
const template = ChatPromptTemplate.fromTemplate(
    `You are a friendly and emotional AI assistant. 
Your role is to greet users warmly and answer their questions politely in 2–5 sentences.  
Always base your answers strictly on the provided context.  
If a question is unrelated to the context, reply: "I’m sorry, I’m still learning. Please ask a question related to FLN Libraries."  

Additional Information:  
- TCLP stands for The Community Library Project.  

Context: {context}  
User Question: {userQuery}
`
)


//LLM Gemini Model
const chatModel = new ChatGoogleGenerativeAI({
    temperature: 0.2,
    model: "gemini-2.5-pro",
    apiKey: process.env.GEMINI_KEY,

})

//chain to pipe template with LLM
const chain = template.pipe(chatModel)


// console.log("model loaded")
// console.log(userQuery)

//condition to check for valid input
if(!userQuery || userQuery.trim() === ""){
    console.log("Please add some input first")
    return
}


//main model run in try and catch blocks
try{
const response = await chain.invoke({userQuery, context})
console.log("Chat Model Response:", response.content);  
return response.content

}

catch(error){
   const fetcherror = error 
   console.error(fetcherror)
    return fetcherror
}

}



