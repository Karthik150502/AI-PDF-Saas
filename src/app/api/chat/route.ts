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

