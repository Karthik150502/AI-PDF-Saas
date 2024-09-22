
import { Pinecone } from "@pinecone-database/pinecone"
import 'dotenv/config'


import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"
import { getEmbeddings } from "./embeddings";
import md5 from "md5"
import { convertToASCII, getChunks } from "./utils";
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";



let pinecone: Pinecone | null = null;
type Vector = {
    id: string,
    values: number[],
    metadata: {
        text: string,
        pageNumber: number
    }
}




export const getPineconeClient = async () => {
    if (!pinecone) {

        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!
        });
    }
    return pinecone
}


type PDFPage = {
    pageContent: string,
    metadata: {
        loc: {
            pageNumber: number
        }
    }
}


export async function loadS3IntoPinecone(fileKey: string) {

    // 1. Obtain the pdf - Download and read from the pdf
    console.log("Downloading s3 into the file system...")
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) {
        throw new Error("Could not download from S3.")
    }

    const loader = new PDFLoader(file_name)
    // const pages = await loader.pages(); // Deprecated....
    const pages = (await loader.load()) as PDFPage[];








    // 2. Split and segment the PDF..
    // return pages;
    const documents = await Promise.all(pages.map(prepareDocument))



    // 3. Vectorise and Embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument))



    // 4. Upload to pinecone 
    const client = await getPineconeClient()
    const pineconeIndex = await client.Index('pdfchatai')

    console.log("Inserting vectors into pinecone.")
    const namespace = convertToASCII(fileKey)
    // PineconeUtils.chunkedUpsert(pineconeIndex, vectors, namespace, 10)


    const chunkedVectors = getChunks(vectors, 10)
    for (const chunk of chunkedVectors) {
        await pineconeIndex.namespace(namespace).upsert([chunk])
    }
    return documents[0]
}



async function embedDocument(doc: Document) {

    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)
        const result = {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as PineconeRecord<RecordMetadata>
        console.log(result)
        return result
    } catch (error) {
        console.log("Error embedding the document ", error)
        throw error
    }
}

export const truncateStringByBytes = (s: string, bytes: number) => {
    const encoding = new TextEncoder()
    return new TextDecoder('utf-8').decode(encoding.encode(s).slice(0, bytes))
}


async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;

    pageContent = pageContent.replaceAll(/\n/g, "")


    // Splitting the doc

    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])


    console.log("Documents from RecursiveCharacterTextSplitter = ", docs)
    console.log("Length of the document = ", docs.length)

    return docs;
}

