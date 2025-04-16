const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { OllamaEmbeddings } = require("@langchain/community/embeddings/ollama");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Ollama } = require("@langchain/community/llms/ollama");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const uploadDir = path.join(__dirname, "Uploads");
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
}).array("file", 5);

const OLLAMA_API_URL = "http://localhost:11434";

const vectorStores = {};
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text", baseUrl: OLLAMA_API_URL });
const llm = new Ollama({ model: "llama3", baseUrl: OLLAMA_API_URL });

app.post("/upload", upload, async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded!" });
        }

        console.log("📂 Files received:", req.files.map(file => file.originalname));
        const fileNames = req.files.map(file => file.originalname);
        res.status(202).json({ message: "Files received. Processing in the background.", files: fileNames });

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 });

        await Promise.all(req.files.map(async (file) => {
            try {
                console.log(`⏳ Processing: ${file.originalname}`);
                let text = "";

                const ext = path.extname(file.originalname).toLowerCase();
                if (ext === ".pdf") {
                    const pdfData = await pdfParse(file.buffer);
                    text = pdfData.text;
                } else if (ext === ".txt") {
                    text = file.buffer.toString("utf-8");
                } else if (ext === ".docx") {
                    const result = await mammoth.extractRawText({ buffer: file.buffer });
                    text = result.value;
                } else {
                    throw new Error("Unsupported file format.");
                }

                if (!text.trim()) {
                    throw new Error(`No text extracted from ${file.originalname}.`);
                }

                const docs = await splitter.createDocuments([text]);
                const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
                vectorStores[file.originalname] = vectorStore;
                console.log(`✅ Processed ${file.originalname}`);
            } catch (fileError) {
                console.error(`❌ Error processing ${file.originalname}:`, fileError);
            }
        }));

    } catch (error) {
        console.error("❌ Error handling files:", error);
        res.status(500).json({ error: "Failed to process files." });
    }
});

app.post("/ask", async (req, res) => {
    try {
        const { question, files } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Please provide a question." });
        }

        const isShortQuestion = question.trim().length < 30;
        const instruction = isShortQuestion
            ? "Provide a concise answer in 1-3 clear bullet points, including all essential details."
            : "Provide a comprehensive, detailed answer in concise bullet points, covering all relevant aspects of the topic thoroughly.";

        // No files selected: generate general answer
        if (!files || !Array.isArray(files) || files.length === 0) {
            console.log(`🔍 No files selected, generating general answer for: ${question}`);
            const prompt = `
You are an intelligent AI assistant. Answer the question based on your general knowledge. ${instruction} If you don't know the answer, respond with a single bullet point: "I don't know."
Question: ${question}
Answer:
`;
            const response = await llm.call(prompt);
            return res.status(200).json({ answer: response.trim() || "- I don't know" });
        }

        console.log(`🔍 Searching across files: ${files.join(", ")}`);

        const searchResults = await Promise.all(
            files.map(async (filename) => {
                if (!vectorStores[filename]) return null;
                const results = await vectorStores[filename].similaritySearch(question, 15);
                return results.length ? { filename, texts: results.map(r => r.pageContent) } : null;
            })
        );

        const bestResults = searchResults.filter(Boolean);
        if (bestResults.length === 0) {
            console.log(`🔍 No relevant info in files, generating general answer for: ${question}`);
            const prompt = `
You are an intelligent AI assistant. Answer the question based on your general knowledge. ${instruction} If you don't know the answer, respond with a single bullet point: "I don't know."
Question: ${question}
Answer:
`;
            const response = await llm.call(prompt);
            return res.status(200).json({ answer: response.trim() || "- I don't know" });
        }

        const context = bestResults.flatMap(result => result.texts).join("\n\n").slice(0, 4000);

        const prompt = `
You are an intelligent AI assistant. Use only the context below to answer the question. ${instruction} If the context doesn't contain enough information, respond with a single bullet point: "I don't know."
Context:
${context}
Question: ${question}
Answer:
`;

        console.log(`📖 Sending prompt to LLaMA...`);
        const response = await llm.call(prompt);

        res.status(200).json({ answer: response.trim() || "- I don't know" });

    } catch (error) {
        console.error("❌ Error processing question:", error);
        res.status(500).json({ error: "Failed to process the question.", details: error.message });
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const { filename } = req.body;
        if (!filename) return res.status(400).json({ error: "Please provide a filename." });

        if (!vectorStores[filename]) {
            return res.status(404).json({ error: "File not found in memory." });
        }

        delete vectorStores[filename];
        console.log(`🗑️ Deleted ${filename} from memory.`);
        res.status(200).json({ message: `${filename} has been deleted.` });

    } catch (error) {
        console.error("❌ Error deleting file:", error);
        res.status(500).json({ error: "Failed to delete file." });
    }
});

app.get("/debug", (req, res) => {
    res.json({ stored_files: Object.keys(vectorStores) });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});