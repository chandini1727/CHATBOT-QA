const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Ollama } = require("@langchain/community/llms/ollama");

const OLLAMA_API_URL = "http://localhost:11434";

const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text", baseUrl: OLLAMA_API_URL });
const llm = new Ollama({ model: "llama3", baseUrl: OLLAMA_API_URL });

const vectorStores = {};

module.exports = {
    embeddings,
    llm,
    vectorStores,
    MemoryVectorStore,
};
