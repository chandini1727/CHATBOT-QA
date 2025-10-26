<h1 align="center">🧠 PDF Chatbot with LangChain, Ollama, and React</h1>

<p align="center">
  <i>Upload PDFs, DOCX, or TXT files and interact intelligently with their content.</i><br/>
  Ask questions about documents or general topics using a locally hosted <b>LLAMA3</b> model.
</p>

<hr/>

## Understanding the Problem

Reading and searching through large documents manually is time-consuming and inefficient.  
Users need a system that allows them to upload multiple files and ask questions about their content, receiving accurate and contextual answers quickly.

**Problem Statement:**  
> Users find it difficult to extract specific insights or information from large text-based documents.

**Goal:**  
> Build a chatbot that allows users to upload files (PDF, DOCX, TXT), extract their content, embed it for context understanding, and provide intelligent responses using local AI models.

---

## Architecture Design
```mermaid
flowchart TD
    subgraph Frontend [Frontend - React Application]
        A[User Interface] --> B[File Uploads & Chat Interface]
        B --> C[Display Uploaded Files & Chat Responses]
    end

    subgraph Backend [Backend - Node.js + Express]
        D[REST API Endpoints] --> E[File Upload Handler - Multer]
        E --> F[Text Extraction (pdf-parse, mammoth)]
        F --> G[LangChain Processing (Text Splitter & Embeddings)]
        G --> H[In-Memory Vector Store]
        D --> I[Question Handling Service]
        I --> J[Ollama LLM Interaction]
    end

    subgraph AI [AI Models - Ollama + LangChain]
        K[LLaMA3 Model] --> J
        L[Nomic-Embed-Text Model] --> G
    end

    subgraph Memory [In-Memory Storage]
        M[VectorStores for Uploaded Files]
    end

    A -->|HTTP Requests| D
    D -->|Embeddings| G
    G -->|Stores Vectors| M
    I -->|Search & Context Retrieval| M
    J -->|Generate Responses| A

    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef ai fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef memory fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px

    class A,B,C frontend
    class D,E,F,G,H,I,J backend
    class K,L ai
    class M memory
````

**Figure:** System Architecture Flow for PDF Chatbot

---

## Functional Requirements

| Feature                      | Description                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| **File Upload**              | Upload multiple files (PDF, DOCX, TXT) with size up to 20MB.                              |
| **Text Extraction**          | Extracts text using `pdf-parse` for PDFs, `mammoth` for DOCX, and UTF-8 decoding for TXT. |
| **Text Embedding**           | Uses `LangChain` with `nomic-embed-text` model to create embeddings.                      |
| **Question Answering**       | Users can ask questions related to uploaded documents or general topics.                  |
| **Short & Detailed Answers** | Automatically detects question length and adjusts answer style.                           |
| **File Deletion**            | Delete uploaded files from memory.                                                        |
| **No Data Persistence**      | All files and embeddings are stored in memory only.                                       |
| **Debug Endpoint**           | Displays stored files for developers.                                                     |

---

## Non-Functional Requirements

| Requirement         | Description                                            |
| ------------------- | ------------------------------------------------------ |
| **Performance**     | Provides quick responses using local embeddings.       |
| **Security**        | No data stored externally; all operations are local.   |
| **Usability**       | Clean and interactive user interface.                  |
| **Maintainability** | Modular structure for backend and frontend components. |
| **Scalability**     | Can handle multiple simultaneous file uploads.         |
| **Reliability**     | Graceful error handling for file and model operations. |

---

## Setup, APIs, and System Interfaces

### 🧩 Environment Variables (`.env`)

```bash
PORT=5000
OLLAMA_API_URL=http://localhost:11434
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

| Method   | Endpoint            | Description                                                        |
| -------- | ------------------- | ------------------------------------------------------------------ |
| `POST`   | `/api/files/upload` | Upload multiple files (PDF, DOCX, TXT). Extract and embed content. |
| `POST`   | `/api/chat/ask`     | Ask a question. Uses embeddings or general AI knowledge.           |
| `DELETE` | `/api/files/delete` | Delete specific uploaded files from memory.                        |
| `GET`    | `/api/files/debug`  | Get list of all currently stored files.                            |

---

## 🧠 System Interfaces

### 🖥️ User Interface

Built using **React.js**, the user interface allows:

* Uploading multiple documents.
* Viewing uploaded files.
* Asking questions and viewing AI responses.
* Switching between light and dark mode.
* Deleting uploaded files manually.

---

### Backend Services

Developed using **Node.js** and **Express.js**, the backend provides APIs for file handling, embedding, and AI responses.

**Core Responsibilities:**

* Manage file uploads using `Multer`.
* Extract document content (`pdf-parse`, `mammoth`).
* Split text into chunks with `RecursiveCharacterTextSplitter`.
* Generate embeddings and store in memory (`MemoryVectorStore`).
* Process user questions and generate responses via Ollama (LLaMA3).

**Libraries Used:**

* `express` – REST API framework
* `cors` – Handle cross-origin requests
* `multer` – File uploads
* `pdf-parse` – Extract text from PDFs
* `mammoth` – Extract text from DOCX files
* `langchain` – Text embedding and retrieval
* `@langchain/community` – LLM and embedding connectors

---

### External Interfaces

| Service            | Purpose                                                         |
| ------------------ | --------------------------------------------------------------- |
| **Ollama**         | Local LLM provider hosting `llama3` and `nomic-embed-text`.     |
| **LangChain**      | Provides text embedding, splitting, and memory-based retrieval. |
| **React Frontend** | Sends API requests and displays responses interactively.        |

---

## Workflow Summary

1. **File Upload** → User uploads files through the React frontend.
2. **Text Extraction** → Backend extracts text using `pdf-parse` or `mammoth`.
3. **Text Splitting** → LangChain splits text into small chunks.
4. **Embedding Generation** → Each text chunk is embedded using `nomic-embed-text`.
5. **Vector Storage** → Embeddings stored temporarily in `MemoryVectorStore`.
6. **Question Input** → User asks a question from the frontend.
7. **Context Search** → Backend searches embeddings for relevant context.
8. **AI Response** → LLaMA3 model generates a context-based or general answer.
9. **Response Display** → The frontend displays the AI’s answer.
10. **File Deletion** → User can delete files from memory manually.

---

## Tech Stack

| Category            | Technology                      |
| ------------------- | ------------------------------- |
| **Frontend**        | React, Axios, CSS               |
| **Backend**         | Node.js, Express.js             |
| **AI/LLM**          | Ollama (LLaMA3)                 |
| **Embeddings**      | LangChain with Nomic Embed Text |
| **Storage**         | In-Memory Vector Store          |
| **Text Processing** | pdf-parse, mammoth              |
| **API Protocol**    | REST (JSON)                     |

---

## Key Code Components

### 1. `app.js`

Initializes the Express server, sets up routes, enables CORS, and runs the backend.

### 2. `fileController.js`

Handles:

* Uploading multiple files.
* Extracting text.
* Generating embeddings and storing them in memory.
* Deleting and debugging stored files.

### 3. `chatController.js`

Handles:

* Question processing.
* Context retrieval from vector stores.
* Response generation using LLaMA3 via Ollama.

### 4. `vectorStore.js`

Defines and initializes:

* Ollama embeddings (`nomic-embed-text`)
* LLM model (`llama3`)
* In-memory vector store for storing file embeddings.

### 5. `routes`

* `fileRoutes.js` → Handles `/upload`, `/delete`, and `/debug`.
* `chatRoutes.js` → Handles `/ask` endpoint.

---

## Developer Notes

* Ensure Ollama is installed and running locally before starting the backend.
* Pull required models:

  ```bash
  ollama pull nomic-embed-text
  ollama pull llama3
  ```
* Run backend:

  ```bash
  cd backend
  npm install
  node app.js
  ```
* Run frontend:

  ```bash
  cd frontend
  npm install
  npm start
  ```
* Frontend URL: `http://localhost:3000`
* Backend URL: `http://localhost:5000`
* All uploaded data and embeddings are stored only in memory and cleared when the server restarts.

---

<p align="center">
  <b>🧠 Intelligent PDF Chatbot | Local Processing | Privacy First</b>
</p>
