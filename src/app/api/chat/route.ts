import { Configuration, OpenAIApi } from 'openai-edge'
import {
    OpenAIStream, StreamingTextResponse, Message
} from 'ai'
import { getContext } from '@/lib/context'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { chat, messages as _messages } from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import { getPrompt } from '@/lib/utils'
import { auth } from "@clerk/nextjs/server";
import AWS from "aws-sdk";
import { getPineconeClient } from '@/lib/pinecone'
import { convertToASCII } from '@/lib/utils'
// export const runtime = 'edge'
// export const dynamic = 'force-dynamic';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
})

const openai = new OpenAIApi(config)

export async function POST(req: Request) {
    try {


        const { messages, chatId } = await req.json()
        console.log(messages)
        const _chats = await db.select().from(chat).where(eq(chat.id, chatId));

        if (_chats.length != 1) {
            console.log({ 'error': 'Chat not found' }, { status: 404 })
            return NextResponse.json({ 'error': 'Chat not found' }, { status: 404 })
        }
        console.log("Chat found")

        const fileName = _chats[0].fileKey
        const lastMsg = messages[messages.length - 1]
        const context = await getContext(lastMsg.content, fileName)

        const prompt = getPrompt(context);
        console.log("Prompt built,", prompt)

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                prompt, ...messages.filter((message: Message) => message.role == 'user')
            ],
            stream: true
        })


        console.log("Chat completion created,", response)

        const stream = OpenAIStream(response, {
            onStart: async () => {
                await db.insert(_messages).values({
                    content: lastMsg.content,
                    chatId,
                    role: "user"

                })
            },
            onCompletion: async (completion) => {
                await db.insert(_messages).values({
                    content: completion,
                    chatId,
                    role: "system"
                })
            }
        });



        return new StreamingTextResponse(stream)


    } catch (error) {
        console.log('Error in initializing the chat = ', error)
        return NextResponse.json({ 'error': 'Error in initializing the chat' }, { status: 500 })
    }
}




export async function DELETE(req: Request) {
    const { userId } = auth();
    if (!!userId) {
        NextResponse.json({ message: 'Not authorized' }, { status: 400 })
    }

    

    const { chatid } = await req.json();

    const singleChat = (await db.select().from(chat).where(eq(chat.id, chatid)))[0];
    if (!singleChat) {
        return NextResponse.json({ message: 'The object you are trying to delete is not found' }, { status: 400 })
    }
    AWS.config.update({
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    })
    try {

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'eu-north-1'
        })

        let fileKey = singleChat.fileKey;
        let params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: fileKey,
        };
        s3.deleteObject(params, (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => {
            if (err) {
                throw new Error("Was not able to delete the object, try again later")
            } else {
                console.log(data)
            }
        })


        const client = await getPineconeClient()
        const pineconeIndex = client.Index('pdfchatai')
        const namespace = convertToASCII(fileKey);
        await pineconeIndex.namespace(namespace).deleteAll()




        let id = await db.delete(chat).where(eq(chat.id, chatid))

        return NextResponse.json({ message: `Chat ${id} successfully deleted.` }, { status: 200 })
    }
    catch (e) {
        return NextResponse.json({ message: `Object delele failed, try again later: ${e}` }, { status: 500 })
    }
}