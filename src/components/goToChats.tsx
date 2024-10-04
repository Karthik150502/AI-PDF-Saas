import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { auth } from '@clerk/nextjs/server'
import { getCachedUserChat } from '@/lib/cache'
import { DrizzleChat } from '@/lib/db/schema'
export default async function GoToChats({ chat }: { chat: DrizzleChat }) {
    // const { userId } = auth();
    // let chat = await getCachedUserChat(userId)


    return (
        <Button className="flex gap-x-1 rounded-none">
            <Link href={`/chats/${chat.id}`}>Go to Chats</Link>
            <ArrowRight strokeWidth={1} />
        </Button>
    )
}
