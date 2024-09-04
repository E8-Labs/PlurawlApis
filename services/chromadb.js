import { ChromaClient } from "chromadb";
import { split } from "sentence-splitter";

const getChromaClient = async (collectionName = "journal_collection") => {
  try {
    const client = new ChromaClient({ host: "http://localhost:8003" });
    const collection = await client.createCollection({ name: collectionName });

    return collection;
  } catch (error) {
    console.log("Chroma client error ", error);
  }
};

export const addToVectorDb = async (journal, user) => {
  try {
    let collection = await getChromaClient();
    let chunks = chunkText(journal.detail, 100);
    console.log("Journal dividedi nto chunks", chunks.length);
    const uniqueTextIds = chunks.map((text, index) => {
      return `${journal.id}_${index + 1}_${user.idd}`;
    });

    const metaDatas = chunks.map((text, index) => {
      return {
        text: text,
        journal_id: journal.id,
        user_id: user.id,
        chunk_id: `${journal.id}_${index + 1}_${user.id}`,
      };
    });
    await collection.add({
      documents: chunks, // we embed for you, or bring your own
      metadatas: metaDatas, // filter on arbitrary metadata!
      ids: uniqueTextIds, // must be unique for each doc
    });

    return true;
  } catch (err) {
    console.error("Error occurred ", err);
    return false;
  }
};

export const findVectorData = async (text, user) => {
  try {
    let collection = await getChromaClient();
    let chunks = chunkText(text, 100);
    console.log("Journal dividedi nto chunks", chunks.length);
    const results = await collection.query({
      queryTexts: chunks,
      nResults: 5,
      where: { user_id: user.id }, // optional filter
      // whereDocument: {"$contains":"search_string"} // optional filter
    });
    console.log("Vector Results ", results);
    return results;
  } catch (error) {}
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
