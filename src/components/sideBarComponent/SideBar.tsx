"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Trash2 as DeleteIcon, Plus, Zap, Home } from 'lucide-react'
import { DrizzleChat } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import ChildConfirmModal from '../ConfirmModal/ConfirmModal'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SlidingSidebarProps {
    chats: DrizzleChat[],
    chatId?: string,
}

export default function SlidingSidebar({
    chats,
    chatId,
}: SlidingSidebarProps) {




    const [loading, setLoading] = useState(false);
    const { toast } = useToast()
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
        setLoading(true)
        const res = await axios.delete("/api/chat", { data: { chatid } })
        if (res.status == 200) {
            let chatid = res.data.nextChatid;
            chatid ? router.push(`/chats/${chatid}`) : router.push(`/`);
            toast({
                title: "Chat was deleted.",
                variant: "default"
            })
        } else {
            toast({
                title: "Cannot delete chat.",
                description: "Chat does not exist or there is some error from our side, kindly try again later.",
                variant: "destructive"
            })
        }
        setLoading(false)
        console.log(res)
    }


    return (
        <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-950 text-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out flex flex-col`}>
            {/* Toggle button */}


            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <button
                            onClick={toggleSidebar}
                            className="absolute -left-6 top-1/2 bg-slate-950 text-white p-2 
                rounded-r-md"
                            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                        >
                            {isOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{isOpen ? 'Close Chats' : 'Close Chats'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>


            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold text-center">DocAI PDF Chatting</h1>
            </div>

            {/* Content area */}
            <ScrollArea className="flex-grow">
                <div className='w-full'>
                    <h2 className="text-right text-sm font-semibold text-gray-400 mb-2 px-2 py-4">Existing chats</h2>
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => { router.push(`/chats/${chat.id}`) }}
                            className={cn("flex items-center justify-between text-xs w-full py-2 px-3 cursor-pointer hover:bg-gray-800 transition-colors", {
                                "bg-gray-800": chat.id === Number(chatId),
                                "pointer-events-none": loading
                            })}
                        >
                            <p className='whitespace-nowrap  text-left text-ellipsis overflow-hidden text-white w-[80%]'>
                                {chat.pdfName}
                            </p>
                            <div className="w-[20%] h-full pl-1">
                                <ChildConfirmModal
                                    trigger={
                                        <DeleteIcon className='text-red-500 hover:scale-110 transition-transform' size={15} strokeWidth={1} />
                                    }
                                    title="Are you sure?"
                                    description={`You want to delete the chat ${chat.pdfName}`}
                                    cancelLabel="Dismiss"
                                    confirmLabel="Delete"
                                    onConfirm={() => {
                                        deleteChat(chat.id)
                                    }}
                                    confirmStyle="bg-red-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Bottom buttons */}
            <div className="p-4 border-t border-gray-800">
                <div className="flex flex-col space-y-2">

                    <Button variant="ghost" className="justify-start rounded-none" onClick={() => { router.push("/") }}>
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Button>
                    <Button variant="ghost" className="justify-start rounded-none" onClick={() => { router.push("/") }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create another chat
                    </Button>
                    <Button variant="default" className="justify-start rounded-none" onClick={handleSubscription} disabled={loading}>
                        <Zap className="mr-2 h-4 w-4" />
                        Upgrade to pro
                    </Button>
                </div>
            </div>
        </div>
    )
}