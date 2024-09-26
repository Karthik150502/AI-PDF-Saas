import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
type Props = {
    chatId: number
}
export default function GoToChats({ chatId }: Props) {
    return (
        <Button className="flex gap-x-1 rounded-full">
            <Link href={`/chats/${chatId}`}>Go to Chats</Link>
            <ArrowRight strokeWidth={1} />
        </Button>
    )
}
