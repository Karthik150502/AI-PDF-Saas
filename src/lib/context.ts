import { Pinecone } from "@pinecone-database/pinecone";
import { convertToASCII } from "./utils";
import { getEmbeddings } from "./embeddings";

import 'dotenv/config'
export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });

    const pineconeIndex = pinecone.Index('pdfchatai')
    try {
        const namespace = convertToASCII(fileKey)


        const queryResult = await pineconeIndex.namespace(namespace).query({
            topK: 3,
            vector: embeddings,
            includeValues: true,
            includeMetadata: true
        });


        console.log('QueriedResult = ', queryResult)
        return queryResult.matches || []
    } catch (error) {
        console.log("Error in querying the embeddings, ", error)
        throw error
    }
}

export async function getContext(query: string, fileKey: string) {
    const queryEmbeddings = await getEmbeddings(query);

    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    const qualifyingDocs = matches.filter(match => match.score && match.score > 0.7)

    type Metadata = {
        text: string,
        pageNumber: number
    }

    console.log("qulifyingDocs = ", qualifyingDocs);


    let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text)
    console.log("docs = ", docs);
    console.log("docs = ", docs.join("\n").substring(0, 3000));

    return docs.join("\n").substring(0, 3000);
}


