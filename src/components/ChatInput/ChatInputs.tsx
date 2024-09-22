'use client'
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'
import MessageList from '../MessageList'
import "./styles.css"
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Message } from 'ai'

type Props = {
    chatId: string
}

export default function ChatInputs({ chatId }: Props) {

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

    return (

        <div className='h-full w-full relative overflow-y-scroll hide_scrl flex flex-col items-center justify-between'>

            <div className="bg-white sticky top-0 inset-x-0 h-fit flex items-center p-2 shadow-sm">
                <h3 className="text-xl font-extrabold overflow-y-hidden">Chats</h3>
            </div>

            <div className="w-full relative">
                <MessageList messages={messages} isLoading={isLoading} />

                <form onSubmit={handleSubmit} className='w-full sticky bottom-0 px-2 py-4 inset-x-0 bg-white shadow-sm'>
                    <div className="flex flex-row gap-x-2 w-full">
                        <Input type='text' onChange={handleInputChange} value={input} className='font-semibold'></Input>
                        <Button className='bg-slate-800'><Send strokeWidth={2} size={15} /></Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
