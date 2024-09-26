"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Trash2 as DeleteIcon, Plus, Zap } from 'lucide-react'
import { DrizzleChat } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import axios from 'axios'

interface SlidingSidebarProps {
    chats: DrizzleChat[],
    chatId?: string,
}

export default function SlidingSidebar({
    chats,
    chatId,
}: SlidingSidebarProps) {




    const [loading, setLoading] = useState(false);

    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter();
    const toggleSidebar = () => setIsOpen(!isOpen)
    const handleSubscription = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url;
        } catch (error) {
            console.log("Error ", error)
        } finally {
            setLoading(false)
        }
    }


    const deleteChat = async (chatid: number) => {
        const res = await axios.delete("/api/chat", { data: { chatid } })
        console.log(res)
    }


    return (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out flex flex-col`}>
            {/* Toggle button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-6 top-1/2 bg-slate-950 text-white p-2 
                rounded-r-md"
                aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>

            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">DocAI PDF Chatting</h1>
            </div>

            {/* Content area */}
            <ScrollArea className="flex-grow">
                <div className="p-4">
                    <h2 className="text-sm font-semibold text-gray-400 mb-2">Existing chats</h2>
                    {chats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => { router.push(`/chats/${chat.id}`) }}
                            className={cn("flex items-center justify-between gap-x-2 text-xs w-full text-left py-2 px-3 rounded-md hover:bg-gray-800 transition-colors", {
                                "bg-gray-800": chat.id === Number(chatId)
                            })}
                        >
                            {chat.pdfName}
                            {/* <DeleteIcon onClick={() => {
                                deleteChat(chat.id)
                            }} className='text-red-500 hover:scale-110 transition-transform' size={15} strokeWidth={1} /> */}
                        </button>
                    ))}
                </div>
            </ScrollArea>

            {/* Bottom buttons */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex flex-col space-y-2">

                    <Button variant="ghost" className="justify-start" onClick={() => { router.push("/") }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create another chat
                    </Button>
                    <Button variant="default" className="justify-start" onClick={handleSubscription} disabled={loading}>
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to pro
                    </Button>
                </div>
            </div>
        </div>
    )
}