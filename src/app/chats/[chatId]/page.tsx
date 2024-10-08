
import React from 'react'
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { chat } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ChatComponent from '@/components/chatComponents/chatComponent'
import DocumentPreview from '@/components/PdfIframe/PdfViewer'
import SlidingSidebar from '@/components/sideBarComponent/SideBar'

type PageProps = {
    params: {
        chatId: string
    }
}

export default async function DocumentAIChat({ params: { chatId } }: PageProps) {
    const { userId } = auth();

    if (!userId) {
        console.log("Use not found, redirecting to sign-in")
        redirect("/sign-in")
    }

    const _chats = await db.select().from(chat).where(eq(chat.userId, userId));
    if (!_chats) {
        console.log("Chats not found, redirecting to the home page.")
        redirect("/")
    }
    const currentChat = _chats.find((chat) => chat.id == parseInt(chatId))

    if (!currentChat) {
        console.log(`Chat ${chatId} not found, redirecting to the home page.`)
        redirect("/")
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}

            <SlidingSidebar
                {...{
                    chats: _chats,
                    chatId: chatId,
                }}
            />
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-center p-4">
                        <h1 className="text-2xl font-semibold">{currentChat.pdfName}</h1>
                    </div>
                </header>


                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-4 h-full">
                        <div className="w-full h-full bg-slate-500 flex lg:flex-row md:flex-col sm:flex-col xs:flex-col">
                            <div className='lg:w-1/2 md:w-full sm:w-full xs:w-full lg:h-full md:h-1/2 sm:h-1/2 xs:h-1/2 bg-white'>
                                <DocumentPreview documentUrl={currentChat?.pdfUrl || ""} />
                            </div>
                            <div className='lg:w-1/2 md:w-full sm:w-full xs:w-full lg:h-full md:h-1/2 sm:h-1/2 xs:h-1/2  bg-white'>
                                <ChatComponent chatId={chatId} />

                            </div>
                        </div>



                    </div>
                </main>
            </div>
        </div>
    )
}


