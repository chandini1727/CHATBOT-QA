const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { embeddings, vectorStores, MemoryVectorStore } = require("../models/vectorStore");

exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded!" });
        }

        console.log("📂 Files received:", req.files.map(f => f.originalname));
        res.status(202).json({
            message: "Files received. Processing in the background.",
            files: req.files.map(f => f.originalname),
        });

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 100 });

        await Promise.all(req.files.map(async (file) => {
            try {
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

                if (!text.trim()) throw new Error(`No text extracted from ${file.originalname}.`);

                const docs = await splitter.createDocuments([text]);
                const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
                vectorStores[file.originalname] = vectorStore;

                console.log(`✅ Processed ${file.originalname}`);
            } catch (err) {
                console.error(`❌ Error processing ${file.originalname}:`, err);
            }
        }));

    } catch (err) {
        console.error("❌ Error handling files:", err);
        res.status(500).json({ error: "Failed to process files." });
    }
};

exports.deleteFile = async (req, res) => {
    const { filename } = req.body;

    if (!filename) return res.status(400).json({ error: "Please provide a filename." });

    if (!vectorStores[filename]) {
        return res.status(404).json({ error: "File not found in memory." });
    }

    delete vectorStores[filename];
    console.log(`🗑️ Deleted ${filename} from memory.`);
    res.status(200).json({ message: `${filename} has been deleted.` });
};

exports.debugFiles = (req, res) => {
    res.json({ stored_files: Object.keys(vectorStores) });
};
