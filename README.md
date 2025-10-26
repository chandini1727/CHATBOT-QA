<h1 align="center">📄 PDF Chatbot with LangChain, Ollama, and React</h1>

<p align="center">
  <i>A full-stack chatbot application that lets you upload PDF files and ask questions about their content.</i><br/>
  Powered by <b>LangChain</b>, <b>Ollama</b>, <b>Express.js</b>, and <b>React</b>.
</p>

<hr/>

## 🎥 Video Demonstration

<div align="center">
  <video width="800" controls>
    <source src="https://drive.google.com/uc?export=download&id=1FN2SRntK-MUbh0TCwWO3SNhMAmiTs2vZ" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

---

## Understanding the Problem

Working with lengthy PDF documents often makes it difficult to extract specific insights or details quickly. Manually searching for information can be time-consuming and inefficient.  

**Problem Statement:**  
> Users struggle to interact with and query large document contents efficiently.

**Goal:**  
> Build a chatbot that allows users to upload PDFs, ask questions about their content, and receive instant, context-aware answers powered by local AI models.

---

## Architecture Design
```mermaid
flowchart TD
    %% Frontend Section
    subgraph Frontend [Frontend - React Application]
        A[User Interface] --> B[File Upload (PDF, DOCX, TXT)]
        B --> C[Question Input and Response Display]
    end

    %% Backend Section
    subgraph Backend [Backend - Node.js + Express.js]
        D[API Routes] --> E[File Handling via Multer]
        E --> F[Content Extraction (PDF-Parse, DOCX Reader)]
        F --> G[Text Splitting via LangChain]
        G --> H[Embedding & Storage in MemoryVectorStore]
        I[Chat Endpoint] --> J[Query Processing via LangChain]
        J --> K[LLM Interaction with Ollama (LLaMA3)]
    end

    %% Local AI Section
    subgraph Ollama [Local AI Engine - Ollama]
        K --> L[LLaMA3 Model]
        H --> L
        L --> J
    end

    %% Flow Connections
    A -->|Axios Requests| D
    D -->|Processed Data| A
    F -->|Extracted Text| G
    G -->|Embeddings| H
    I -->|User Query| J
    J -->|Response| A

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class A,B,C frontend
    class D,E,F,G,H,I,J backend
    class K,L ai
````

**Figure:** System Architecture Flow for PDF Chatbot
This diagram shows how the React frontend communicates with the Express backend and the local Ollama AI engine for intelligent PDF question answering.

---

## Functional Requirements

| Feature                  | Description                                                  |
| ------------------------ | ------------------------------------------------------------ |
| **Multi-file Upload**    | Upload multiple PDF, DOCX, or TXT files (up to 20MB each).   |
| **Text Extraction**      | Extracts content using `pdf-parse` and other parsers.        |
| **Content Embedding**    | Uses `nomic-embed-text` via LangChain for vector embeddings. |
| **Question Answering**   | Handles user queries contextually based on uploaded files.   |
| **Local LLM Inference**  | Runs on LLaMA3 through Ollama for fast responses.            |
| **Dark/Light Mode**      | UI toggle for user comfort.                                  |
| **In-memory Processing** | No external storage; all embeddings are handled in memory.   |
| **File Deletion**        | Supports file removal from memory to manage session data.    |

---

## Non-Functional Requirements

| Requirement         | Description                                                |
| ------------------- | ---------------------------------------------------------- |
| **Scalability**     | Designed to support multiple concurrent uploads.           |
| **Performance**     | Quick text extraction and embedding generation.            |
| **Reliability**     | Embedding and querying handled efficiently with LangChain. |
| **Security**        | Local inference ensures data privacy.                      |
| **Maintainability** | Modular backend with separate controllers for clarity.     |
| **Error Handling**  | Graceful handling for unsupported or corrupted files.      |

---

## Setup, APIs, and System Interfaces

### 🧩 Environment Setup

```bash
# Start Ollama and pull required models
ollama pull nomic-embed-text
ollama pull llama3
```

---

### 📦 Backend Setup

```bash
cd backend
npm install
node app.js
```

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at **[http://localhost:3000](http://localhost:3000)**

---

## API Endpoints

| Method   | Endpoint            | Description                                                  |
| -------- | ------------------- | ------------------------------------------------------------ |
| `POST`   | `/api/files/upload` | Upload up to 5 files (PDF, DOCX, TXT) for processing.        |
| `POST`   | `/api/chat/ask`     | Submit a question about the uploaded documents.              |
| `DELETE` | `/api/files/delete` | Delete a specific file from memory.                          |
| `GET`    | `/api/files/debug`  | Retrieve a list of currently stored filenames (for testing). |

---

## 🧠 System Interfaces

### 🖥️ User Interface

Built with **React**, providing:

* File upload interface with progress feedback
* Question input box
* Chat-style response display
* Theme toggle (dark/light)
* File management (delete/reset)

---

### Backend Services

Developed with **Node.js** and **Express.js**, responsible for:

* File uploads (via Multer)
* Parsing PDF/DOCX/TXT files
* Managing embeddings with LangChain
* Handling user chat queries through Ollama

**Libraries Used:**

* `express` – Server framework
* `multer` – File upload handling
* `pdf-parse` – PDF content extraction
* `langchain` – Embedding and LLM orchestration
* `axios` – HTTP requests
* `ollama` – Local LLM runtime

---

### Local AI Engine (Ollama)

* Handles inference using **LLaMA3** for natural language processing.
* Uses **nomic-embed-text** for vector embeddings.
* Enables offline, private, and low-latency responses.

---

## Workflow Summary

1. **Upload Files** → User uploads PDF, DOCX, or TXT files.
2. **Extract Text** → Backend extracts content using `pdf-parse`.
3. **Embed Content** → LangChain creates embeddings via `nomic-embed-text`.
4. **Ask Question** → User submits a query through the React interface.
5. **Retrieve Context** → LangChain retrieves relevant document chunks.
6. **Generate Response** → Ollama (LLaMA3) generates context-aware answers.
7. **Display Output** → Frontend shows formatted chatbot responses.

---

## Tech Stack

| Category           | Technology                               |
| ------------------ | ---------------------------------------- |
| **Frontend**       | React.js, Axios, CSS                     |
| **Backend**        | Node.js, Express.js, Multer              |
| **AI/LLM**         | Ollama (LLaMA3, nomic-embed-text)        |
| **Vector Store**   | LangChain MemoryVectorStore              |
| **Text Splitting** | LangChain RecursiveCharacterTextSplitter |
| **File Parsing**   | pdf-parse                                |
| **Utilities**      | dotenv, nodemon                          |

---

## Key Code Components

### File Upload Handler

```js
router.post('/upload', upload.array('files', 5), async (req, res) => {
  const files = req.files;
  // Parse and embed content
});
```

---

### Chat Query Processing

```js
const response = await model.invoke({
  input: userQuestion,
  context: relevantDocs
});
res.json({ answer: response });
```

---

### Developer Notes

* Efficient in-memory embedding storage for lightweight sessions
* Easily extendable to persistent databases (e.g., PostgreSQL or Pinecone)
* Modular codebase (controllers, routes, services)
* Runs entirely offline with local models
* Privacy-focused and fast response generation

---

<p align="center">
  <b>📄 Smart Document Interaction | Instant Insights | Privacy-First AI</b>
</p>
```
