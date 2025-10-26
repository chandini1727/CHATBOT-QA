# 📄 PDF Chatbot with LangChain, Ollama, and React
A full-stack chatbot application that lets you upload PDF files and ask questions about their content. Powered by LangChain, Ollama, Express.js, and React.
## video 
   👉 https://drive.google.com/file/d/1FN2SRntK-MUbh0TCwWO3SNhMAmiTs2vZ/view?usp=drive_link

## 🚀 Features

- Upload multiple PDF, DOCX, TXT files (20MB max each)
- Extracts and embeds content using LangChain
- Ask questions about file contents or general topics
- Fast answers via local LLaMA3 model
- Toggle light/dark mode
- Delete uploaded files
- No external storage — all in-memory

## Overall System Flow
```mermaid
flowchart TD
    subgraph Phase1[Phase 1: File Upload & Processing]
        A[User Uploads Multiple Files] --> B[Backend Processes All Files]
        B --> C[Store Vectors with Filename Keys]
        C --> D[Files Ready for Selection]
    end
    
    subgraph Phase2[Phase 2: File Selection & Question]
        E[User Selects Specific File] --> F[User Asks Question]
        F --> G{Question Based on Selected File?}
        G -->|Yes| H[Search Only Selected File]
        G -->|No/General| I[Use General Knowledge]
        H --> J[Get Context from Selected File]
        J --> K[Generate Contextual Answer]
        I --> L[Generate General Knowledge Answer]
    end
    
    subgraph Phase3[Phase 3: Response Delivery]
        K --> M[Return File-Based Answer]
        L --> N[Return General Knowledge Answer]
        M --> O[Display to User]
        N --> O
    end
```
## End-to-End User
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant V as Vector Store
    participant O as Ollama

    Note over U,B: Phase 1: Upload Multiple Files
    U->>F: Upload Multiple Files (PDF/DOCX/TXT)
    F->>B: POST /api/files/upload
    B->>B: Process all files in parallel
    B->>V: Store vectors with filename keys
    B->>F: Return success with filenames
    F->>U: Show uploaded files list
    
    Note over U,B: Phase 2: Select File & Ask Question
    U->>F: Select specific file from list
    U->>F: Type question about selected file
    F->>B: POST /api/chat/ask {question, selectedFiles: ['filename.pdf']}
    
    B->>B: Check if selected files exist
    B->>V: Search ONLY in selected file's vector store
    V->>B: Return relevant chunks from selected file
    
    B->>B: Analyze if context is sufficient
    B->>B: {Context Found in Selected File?}
    
    alt Context Found in Selected File
        B->>B: Construct prompt with file context
        B->>O: Send to LLaMA3 with file context
        O->>B: Generate answer based on file
    else No Context in Selected File
        B->>B: Construct general knowledge prompt
        B->>O: Send to LLaMA3 with general knowledge
        O->>B: Generate general knowledge answer
    end
    
    B->>F: Return appropriate answer
    F->>U: Display answer with context source
```
## File Upload Workflow
```mermaid
flowchart TD
    Start[User Uploads Multiple Files] --> Validate[Validate Files]
    Validate --> Accept[Return 202 Accepted]
    
    Accept --> Parallel[Process Files in Background]
    
    subgraph FileProcessing [Individual File Processing]
        direction TB
        A[File Buffer] --> B{Detect Format}
        B -->|PDF| C[pdf-parse]
        B -->|DOCX| D[mammoth]
        B -->|TXT| E[Buffer.toString]
        C --> F[Extract Text]
        D --> F
        E --> F
        F --> G[Split into 500-char chunks]
        G --> H[Generate embeddings]
        H --> I[Create Vector Store]
        I --> J[Store with filename key]
    end
    
    Parallel --> P1[Process File 1]
    Parallel --> P2[Process File 2]
    Parallel --> P3[Process File N]
    
    P1 --> FileProcessing
    P2 --> FileProcessing  
    P3 --> FileProcessing
    
    J --> Complete[All Files Ready for Selection]
```
## File Selection & Question Workflow
```mermaid
flowchart TD
    Start[User Action] --> Select[User Selects File from List]
    Select --> Input[User Types Question]
    Input --> Send[Send to Backend with Selected File]
    
    Send --> Validate{Selected File Exists?}
    Validate -->|No| Error[Return File Not Found]
    Validate -->|Yes| Search[Search in Selected File Only]
    
    Search --> GetVectors[Get Vector Store for Selected File]
    GetVectors --> Similarity[Similarity Search 15 chunks]
    Similarity --> ContextCheck{Found Relevant Context?}
    
    ContextCheck -->|Yes| FileContext[Use File Context]
    ContextCheck -->|No| General[Use General Knowledge]
    
    FileContext --> ConstructFile[Construct File-Based Prompt]
    General --> ConstructGeneral[Construct General Prompt]
    
    ConstructFile --> LLM[Call LLaMA3]
    ConstructGeneral --> LLM
    
    LLM --> Response[Format Response]
    Response --> Return[Return Answer with Source Info]
    
    Error --> ReturnError[Return Error Message]
```

## 🧱 Tech Stack

- **Frontend**: React, Axios, CSS
- **Backend**: Node.js, Express, Multer
- **AI/LLM**: [Ollama](https://ollama.com/) (LLaMA3 + nomic-embed-text)
- **Vector Store**: LangChain `MemoryVectorStore`
- **Text Splitting**: LangChain `RecursiveCharacterTextSplitter`
- **PDF Parsing**: `pdf-parse`

  ## 📡 API Endpoints

| Method   | Endpoint             | Description                                                               |
|----------|----------------------|---------------------------------------------------------------------------|
| `POST`   | `/api/files/upload`  | Upload up to 5 files (PDF, DOCX, TXT). Files are parsed and embedded.     |
| `POST`   | `/api/chat/ask`      | Ask a question. Can be general or based on uploaded files.                |
| `DELETE` | `/api/files/delete`  | Delete a file from memory by filename.                                    |
| `GET`    | `/api/files/debug`   | Get a list of currently stored filenames in memory (for development use). |


## Start Ollama with Required Models
Install Ollama if you haven't:
👉 https://ollama.com/download
` ``bash
  ollama pull nomic-embed-text
  ollama pull llama3
                       ` `
## Backend Setup

    ` ``bash
          cd backend
          npm install
          node app.js 
           

## Frontend Setup
    ` ``bash
         cd frontend
        npm install
        npm start
                   ` `
Frontend runs on: http://localhost:3000
