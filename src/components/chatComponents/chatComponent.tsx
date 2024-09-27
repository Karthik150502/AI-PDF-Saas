'use client'
import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useChat } from 'ai/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'
import "./styles.css"
import { cn } from '@/lib/utils'
export default function ChatComponent({ chatId }: { chatId: string }) {




    const { data, isLoading } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>('/api/get-messages', { chatId })
            console.log(response)
            return response.data
        }
    })


    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat',
        body: {
            chatId,
        },
        initialMessages: data || []
    });


    React.useEffect(() => {
        const messageContainer = document.getElementById("msg-cont")
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])



    return (
        <div className="flex flex-col h-full w-full">
            : <div className="flex-1 overflow-y-auto hide-scroll p-4 space-y-4 msg-cont">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >

                        <div
                            className={cn("ring-1 ring-gray-900/10 max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-2 shadow-md", message.role === 'user'
                                ? 'bg-gray-200 text-black rounded-tr-md rounded-tl-md rounded-bl-md'
                                : 'bg-gray-400 text-gray-800  rounded-tr-md rounded-tl-md rounded-br-md')}
                        >
                            <p

                                className="text-sm">{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                    >
                        <Send className="w-5 h-5" strokeWidth={1} />
                    </button>
                </div>
            </form>
        </div>
    )
}