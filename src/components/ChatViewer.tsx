'use client'
import React from 'react'
import { Button } from './ui/button'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import { Plus, MessageCircle, Trash2 as DeleteIcon } from 'lucide-react'
import clsx from 'clsx'
import axios from 'axios'
type Props = {
    chats: DrizzleChat[],
    chatId: number
}

export default function ChatViewer({ chatId, chats }: Props) {


    const [loading, setLoading] = React.useState(false);

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




    return (
        <div className='w-full h-screen pt-10 bg-white flex flex-col items-center'>
            <Link href="/" className=''>
                <Button className='rounded-none font-extrabold text-xs'> <Plus size={18} strokeWidth='2' /></Button>
            </Link>

            <div className="flex flex-col mt-4 w-full">
                {
                    chats.map((chat, i) => {
                        return <Link key={chat.id} className='' href={`/chats/${chat.id}`}>
                            <div className={clsx(' transition-colors flex flex-row gap-x-1 p-2 py-4', i == 0 ? 'border-y' : 'border-b ', chat.id == chatId ? 'bg-slate-200' : 'hover:bg-slate-100')}>
                                <MessageCircle className='text-black' size={15} strokeWidth={1} />
                                <p className='text-black text-xs whitespace-nowrap text-ellipsis w-full overflow-hidden truncate'>
                                    {chat.pdfName}
                                </p>
                                
                            </div>
                        </Link>
                    })
                }
            </div>


            <div className="w-full flex flex-col items-center justify-center absolute bottom-4">
                <div className="flex flex-col items-center gap-2 text-sm font-extrabold flex-wrap">
                    <Link href="/home">Home</Link>
                    <Link href="/source">Source</Link>
                </div>
                {/* Stripe Button */}
                <Button className='mt-2 text-white bg-slate-800 ' onClick={handleSubscription} disabled={loading}>
                    Upgrade to pro
                </Button>
            </div>
        </div >
    )
}
