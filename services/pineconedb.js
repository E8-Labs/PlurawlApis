import { Pinecone }  from '@pinecone-database/pinecone';
import { split } from 'sentence-splitter';
import OpenAI from "openai";



const openai = new OpenAI({ apiKey: process.env.AIKey });


const pineconeClient = new Pinecone({
    apiKey: process.env.PineConeApiKey
  });
  
  const indexName = 'journal-collection';
  const indexNameChat = 'plurawl-chat-collection';
  
  (async () => {
    
  
    const existingIndexes = await pineconeClient.listIndexes();
    const indexNames = existingIndexes.indexes.map(index => index.name);
    let indexes = [indexName, indexNameChat]
    console.log("Existing", indexNames)
    for(let i = 0; i < indexes.length; i++){
      let ind = indexes[i]
      if (indexNames.length > 0 && indexNames.includes(ind)) {
      
      }
      else{
        await pineconeClient.createIndex({
          name: ind,
          dimension: 1536, // OpenAI embedding dimension
          metric: 'euclidean', // Replace with your model metric
          spec: { 
              serverless: { 
                  cloud: 'aws', 
                  region: 'us-east-1' 
              }
          } 
        });
      }
    }
  })();







  export const addToVectorDb = async (journal, user) => {
    try {
      
      let chunks = chunkText(journal.journalText, 100);
      console.log("Journal divided into chunks", journal.journalText);
    
      const pineConeIndex = pineconeClient.Index(indexName);
        
    let embeddings = await getChunkEmbeddings(chunks)
    await Promise.all(embeddings.map(async (embedding, index) => {
        let id = `${journal.id}_${index + 1}_${user.id}`
        await pineConeIndex.upsert(
            [
              {
                // date: `${Date.now()}`,
                id: id,
                values: embedding.embedding,
                metadata: { text: embedding.text, userId: user.id, journalId: journal.id },
              },
            ],
        );
      }));
  
      return true;
    } catch (err) {
      console.error("Error occurred ", err);
      return false;
    }
  };



  export const addToVectorDbChat = async (message, chat, user) => {
    try {
      
      let chunks = chunkText(message, 200);
      console.log("Journal divided into chunks", message);
    
      const pineConeIndex = pineconeClient.Index(indexNameChat);
        
    let embeddings = await getChunkEmbeddings(chunks)
    await Promise.all(embeddings.map(async (embedding, index) => {
        let id = `${Date.now()}-${chat.id}_${index + 1}_${user.id}`
        await pineConeIndex.upsert(
            [
              {
                // date: `${Date.now()}`,
                id: id,
                values: embedding.embedding,
                metadata: { text: embedding.text, userId: user.id, chatId: chat.id },
              },
            ],
        );
      }));
  
      return true;
    } catch (err) {
      console.error("Error occurred ", err);
      return false;
    }
  };


  export const findVectorData = async (text, user) => {
    try {
        console.log('FindingForVector', text)
      // const { chatId, query } = req.body;
      let topVectors = 2;
      // if(query == null){
      //   console.log("Find Context  query null", text)
      //   topVectors = 5
      // }
      let chunks = chunkText(text);
      const queryEmbedding = await getChunkEmbeddings(chunks);
  
      const index = pineconeClient.Index(indexName);
      const allResults = [];
      for (const embedding of queryEmbedding) {
        // console.log(`Sending  to vector db`, JSON.stringify(embedding))
        const searchResults = await index.query({
          topK: topVectors,
          vector: embedding.embedding,
          includeMetadata: true,
          filter: {
            userId: user.id,
          },
        });
        // console.log("Found results ", searchResults.length)
        allResults.push(searchResults);
      }
  
    //   console.log("All Results ", allResults);
    //   console.log("Comtext Result", JSON.stringify(allResults));
      if (!allResults) {
        return null;
      }
      const contextTexts = Array.from(
        new Set(
          allResults.flatMap(result =>
            result.matches.map(match => match.metadata.text)
          )
        )
      );
      // return allResults
      console.log("Found context for journal", contextTexts)
      let context = ""
      contextTexts.map((text)=> {
        context = `${context}\n${text}`
      })
      return context;//contextTexts;
    } catch (error) {
      console.log("Error finding context ", error);
      return null;
    }
  };



  export const findVectorDataChat = async (text, chat, user) => {
    try {
        console.log(`FindingForVector  for user ${user.id}`, text)
      // const { chatId, query } = req.body;
      let topVectors = 5;
      // if(query == null){
      //   console.log("Find Context  query null", text)
      //   topVectors = 5
      // }
      let chunks = chunkText(text, 200);
      const queryEmbedding = await getChunkEmbeddings(chunks);
  
      const index = pineconeClient.Index(indexNameChat);
      const allResults = [];
      for (const embedding of queryEmbedding) {
        // console.log(`Sending  to vector db`, JSON.stringify(embedding))
        const searchResults = await index.query({
          topK: topVectors,
          vector: embedding.embedding,
          includeMetadata: true,
          filter: {
            userId: user.id,
            // chatId: chat.id
          },
        });
        // console.log("Found results ", searchResults.length)
        allResults.push(searchResults);
      }
  
    //   console.log("All Results ", allResults);
    //   console.log("Comtext Result", JSON.stringify(allResults));
      if (!allResults) {
        return null;
      }
      const contextTexts = Array.from(
        new Set(
          allResults.flatMap(result =>
            result.matches.map(match => match.metadata.text)
          )
        )
      );
      // return allResults
      console.log("Found context for journal", contextTexts)
      let context = ""
      contextTexts.map((text)=> {
        context = `${context}\n${text}`
      })
      return context;//contextTexts;
    } catch (error) {
      console.log("Error finding context ", error);
      return null;
    }
  };






  async function getChunkEmbeddings(textChunks) {
    const embeddings = await Promise.all(textChunks.map(async (chunk) => {
      console.log("Chunk size is ", chunk.length)
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunk,
        encoding_format: "float",
      });
      return {embedding: response.data[0].embedding, text: chunk};
    }));
    return embeddings;
  }


const getEmbedding = async (text) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
    encoding_format: "float",
  });
  console.log("Embeddings response ", response)
  return response.data[0].embedding;
};

function chunkText(text, maxTokens = 100) {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid input text");
    }
  
    try {
      // Split the text into sentences
      const sentences = split(text).map((sentence) => sentence.raw);
  
      let currentChunk = [];
      let currentTokenCount = 0;
      const chunks = [];
  
      sentences.forEach((sentence) => {
        // Split sentence into words and count tokens
        const words = sentence.split(" ");
        const tokenCount = words.length;
  
        // Check if adding the sentence would exceed max tokens
        if (currentTokenCount + tokenCount > maxTokens) {
          // Push the current chunk and start a new one
          chunks.push(currentChunk.join(" ").trim());
          currentChunk = words;
          currentTokenCount = tokenCount;
        } else {
          // Add words to the current chunk
          currentChunk.push(...words);
          currentTokenCount += tokenCount;
        }
      });
  
      // Push the last chunk if not empty
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" ").trim());
      }
  
      return chunks;
    } catch (error) {
      console.error("Error while chunking text:", error);
      throw new Error("Failed to chunk text");
    }
  }