import { db } from '@/lib/db';
import { chat } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import ChatViewer from '@/components/ChatViewer';
import PDFViewer from '@/components/PDFViewer';
import ChatInputs from '@/components/ChatInput/ChatInputs';
import React from 'react'
import "./styles.css"



type props = {
    params: {
        chatId: string
    }
}

export default async function page({ params: { chatId } }: props) {

    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in")
    }

    const _chats = await db.select().from(chat).where(eq(chat.userId, userId));
    if (!_chats) {
        redirect("/")
    }

    if (!_chats.find((chat) => chat.id == parseInt(chatId))) {
        redirect("/")
    }
    const currentChat = _chats.find((chat) => chat.id == parseInt(chatId))


    return (
        <div className='flex overflow-scroll hide_scrl max-h-screen'>
            <div className='flex max-h-screen w-full overflow-scroll hide_scrl'>
                {/* Chats Viewer */}
                <div className='flex-[1] max-w-xs'>
                    <ChatViewer chatId={parseInt(chatId)} chats={_chats} />
                </div>


                <div className="flex-[5] overflow-scroll hide_scrl max-h-screen">
                    <PDFViewer pdfUrl={currentChat?.pdfUrl || ""} />
                </div>


                <div className="flex-[3] hide_scrl max-h-screen">
                    <ChatInputs chatId={chatId} />
                </div>

            </div>
        </div>
    )
}
