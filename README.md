# PDF Chatbot with LangChain, Ollama, and React

A full-stack chatbot application that allows users to upload PDF, DOCX, or TXT files and ask intelligent questions about their content. It integrates **LangChain**, **Ollama**, **Express.js**, and **React** to provide a seamless document-based conversational experience.

---

## 1. Understanding the Problem

Extracting specific information from long documents is often tedious and time-consuming. Traditional chatbots cannot interpret or respond based on user-provided files. This project addresses that gap by enabling users to upload their own files and chat directly with the content — providing contextual, AI-powered answers without external storage or cloud dependency.

---

## 2. Architecture Design

The system follows a **modular client-server architecture**:

- **Frontend (React)** – Handles file uploads, user input, and response visualization.  
- **Backend (Express.js)** – Manages file parsing, embedding generation, and response orchestration.  
- **AI Layer (LangChain + Ollama)** – Embeds textual data and generates contextually accurate responses using a local LLaMA3 model.

**Architecture Flow:**
1. User uploads PDF/DOCX/TXT files.  
2. Backend extracts and splits text into manageable chunks.  
3. LangChain converts text into embeddings and stores them in memory.  
4. User asks a question.  
5. Similarity search retrieves relevant text chunks.  
6. Ollama’s LLaMA3 model generates a context-aware response.

---

## 3. Functional Requirements

| Requirement | Description |
|--------------|-------------|
| File Upload | Upload up to 5 files (PDF, DOCX, TXT), each ≤ 20MB. |
| Text Extraction | Parse and extract textual content from files. |
| Embedding Generation | Convert text into vector embeddings using LangChain. |
| Contextual Q&A | Generate intelligent responses using document context or general knowledge. |
| File Management | Delete uploaded files from in-memory storage. |
| Theme Toggle | Support light and dark modes in frontend. |

---

## 4. Non-Functional Requirements

| Category | Specification |
|-----------|---------------|
| Performance | Answers generated within 2–4 seconds. |
| Scalability | Supports multiple concurrent users (in-memory). |
| Security | No data stored externally; fully local processing. |
| Reliability | Handles missing or invalid files gracefully. |
| Portability | Runs locally with Node.js and Ollama. |
| Maintainability | Modular and easily extendable code structure. |

---

## 5. Environment Variables

Create a `.env` file in the backend directory:

```

PORT=5000
FRONTEND_URL=[http://localhost:3000](http://localhost:3000)
OLLAMA_API_URL=[http://localhost:11434](http://localhost:11434)

````

---

## 6. API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/files/upload` | Upload and process up to 5 PDF/DOCX/TXT files. |
| `POST` | `/api/chat/ask` | Ask a question (based on document or general knowledge). |
| `DELETE` | `/api/files/delete` | Delete a file from memory. |
| `GET` | `/api/files/debug` | View all stored files (for debugging). |

---

## 7. System Interface

**Backend Interface:**
```json
{
  "question": "What is the summary of the uploaded document?",
  "files": ["example.pdf"]
}
````

**Frontend Interface:**

* Upload files
* Ask questions
* Display responses

---

## 8. User Interface

* File upload section (drag-and-drop)
* Chat input box
* Response display area
* File list with delete button
* Light/Dark mode toggle

---

## 9. Backend Services

| Service            | Responsibility                                          |
| ------------------ | ------------------------------------------------------- |
| File Controller    | Handles upload, parsing, embedding, and memory storage. |
| Chat Controller    | Processes questions and generates responses.            |
| Vector Store Model | Maintains embeddings in memory.                         |
| Ollama Service     | Hosts LLaMA3 and nomic-embed-text models locally.       |

---

## 10. Libraries Used

### Backend

* express
* cors
* multer
* pdf-parse
* mammoth
* langchain
* @langchain/community

### Frontend

* react
* axios

---

## 11. External Interfaces

| Interface  | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| Ollama API | Local API at `http://localhost:11434` running LLaMA3 and embedding models. |
| Browser    | Web interface at `http://localhost:3000`.                                  |

---

## 12. Workflow Summary

1. **Upload Phase:** Files are uploaded, parsed, split, embedded, and stored in memory.
2. **Query Phase:** User asks a question → backend performs similarity search → LLaMA3 generates response.
3. **Cleanup Phase:** User can delete specific files to clear memory.

---

## 13. Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Frontend     | React, Axios                                  |
| Backend      | Node.js, Express                              |
| AI/Embedding | LangChain + Ollama (LLaMA3, nomic-embed-text) |
| Storage      | In-memory Vector Store                        |
| Parsing      | pdf-parse, mammoth                            |

---

## 14. Key Components in Code

| Component       | File                            | Description                                       |
| --------------- | ------------------------------- | ------------------------------------------------- |
| Chat Controller | `controllers/chatController.js` | Handles Q&A using LLaMA3 and embeddings.          |
| File Controller | `controllers/fileController.js` | Uploads, parses, embeds text.                     |
| Vector Model    | `models/vectorStore.js`         | Initializes Ollama embeddings and vector stores.  |
| Chat Routes     | `routes/chatRoutes.js`          | Defines `/api/chat/ask` endpoint.                 |
| File Routes     | `routes/fileRoutes.js`          | Handles `/api/files/upload`, `/delete`, `/debug`. |
| Server          | `app.js`                        | Initializes routes, middleware, and CORS.         |

---

## 15. Developer Notes

* Pull models before running backend:

  ```bash
  ollama pull nomic-embed-text
  ollama pull llama3
  ```
* Backend: `http://localhost:5000`
* Frontend: `http://localhost:3000`
* Debug files: `/api/files/debug`
* No external database or cloud storage used.

---

## 16. Video Demonstration

<iframe width="100%" height="400" src="https://drive.google.com/file/d/1FN2SRntK-MUbh0TCwWO3SNhMAmiTs2vZ/preview" allow="autoplay; encrypted-media" allowFullScreen ></iframe> ```
