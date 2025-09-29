



export interface IDocument {
  id: string;             // Unique identifier for the document
  title: string;          // Human-readable title
  html: string;           // HTML content
  css: string;            // CSS styles
  jsonStructure: Record<string, any>;  // JSON schema/structure
  jsonData: Record<string, any>;       // JSON with current data (backup or live content)
}

export interface IFolder {
    id: string;
    name: string;
    idDocuments: string[];
}


// const IDocuments: IDocument[] = [];