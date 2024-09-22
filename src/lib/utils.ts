import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import 'dotenv/config'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertToASCII(s: string) {
  // Remove all non-ASCII characters

  const asciiString = s.replace(/[^\x00-\x7F]+/g, "")
  return asciiString;
}

export const getChunks = (array: PineconeRecord<RecordMetadata>[], batchSize: number = 10) => {
  const chunks: PineconeRecord<RecordMetadata>[] = [];

  for (let i = 0; i < array.length; i += batchSize) {
    // chunks.push(array.slice(i, i + batchSize));
    chunks.push(array[i]);
  }

  return chunks;
};



export function getPrompt(context: string, role: string = 'system') {
  return {
    role,
    content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI is a well-behaved and well-mannered individual.
    AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
    AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
    AI assistant is a big fan of Pinecone and Vercel.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will not invent anything that is not drawn directly from the context.
    `,
  }
}




