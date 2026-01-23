

const baseUrl = import.meta.env.VITE_API_PDF_URL;
const token = localStorage.getItem("token");

export const pdfService = ( apikey: string, documentId: string ) => {

    console.log("apikey", apikey);
    console.log("documentId", documentId);

    const fetchPdf = async () => {
        try {
            const response = await fetch(`${baseUrl}/generatePdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    apiKey: apikey,
                    documentId: documentId
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    return fetchPdf();
}
