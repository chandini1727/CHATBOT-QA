const { vectorStores, llm } = require("../models/vectorStore");

exports.askQuestion = async (req, res) => {
    try {
        const { question, files } = req.body;
        if (!question) return res.status(400).json({ error: "Please provide a question." });

        const isShort = question.trim().length < 30;
        const instruction = isShort
            ? "Provide a concise answer in 1-3 clear bullet points, including all essential details."
            : "Provide a comprehensive, detailed answer in concise bullet points, covering all relevant aspects of the topic thoroughly.";

        if (!files || !Array.isArray(files) || files.length === 0) {
            const prompt = `
You are an intelligent AI assistant. Answer the question based on your general knowledge. ${instruction}
If you don't know the answer, respond with a single bullet point: "I don't know."
Question: ${question}
Answer:`;
            const response = await llm.call(prompt);
            return res.status(200).json({ answer: response.trim() || "- I don't know" });
        }

        const searchResults = await Promise.all(files.map(async filename => {
            const store = vectorStores[filename];
            if (!store) return null;
            const results = await store.similaritySearch(question, 15);
            return results.length ? { filename, texts: results.map(r => r.pageContent) } : null;
        }));

        const bestResults = searchResults.filter(Boolean);
        if (bestResults.length === 0) {
            const prompt = `
You are an intelligent AI assistant. Answer the question based on your general knowledge. ${instruction}
If you don't know the answer, respond with a single bullet point: "I don't know."
Question: ${question}
Answer:`;
            const response = await llm.call(prompt);
            return res.status(200).json({ answer: response.trim() || "- I don't know" });
        }

        const context = bestResults.flatMap(r => r.texts).join("\n\n").slice(0, 4000);
        const prompt = `
You are an intelligent AI assistant. Use only the context below to answer the question. ${instruction}
If the context doesn't contain enough information, respond with a single bullet point: "I don't know."
Context:
${context}
Question: ${question}
Answer:`;

        const response = await llm.call(prompt);
        res.status(200).json({ answer: response.trim() || "- I don't know" });

    } catch (err) {
        console.error("❌ Error processing question:", err);
        res.status(500).json({ error: "Failed to process the question.", details: err.message });
    }
};
