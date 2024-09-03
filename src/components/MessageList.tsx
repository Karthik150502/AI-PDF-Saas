import React from 'react'
import { Message } from 'ai/react'
import clsx from 'clsx'
import Loading from './ui/Loading/Loading'
type Props = {
    isLoading: boolean,
    messages: Message[]
}

export default function MessageList({ messages, isLoading }: Props) {

    if (isLoading) {
        return <div className='absolute left-1/2 top-1/2 w-fit h-fit'>
            <Loading />
        </div>
    }


    if (!messages) {
        return <div className='w-full h-40 bg-slate-600'></div>
    }

    React.useEffect(() => {
        const messageContainer = document.getElementById("message-container")
        if (messageContainer) {
            messageContainer.scrollTo({
                top: messageContainer.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])


    return (
        <div className='w-full flex flex-col gap-y-2 px-4 py-6 scroll-mb-0' id='message-container'>
            {
                messages.map((msg) => {
                    return (
                        <div key={msg.id} className={clsx(
                            {
                                'justify-start': msg.role === 'assistant',
                                'justify-end': msg.role === 'user',
                            }, 'flex'
                        )}>
                            <div className={clsx(
                                {
                                    'bg-slate-100 text-black': msg.role === 'assistant',
                                    'bg-slate-500 text-black': msg.role === 'user',
                                }, 'rounded-md text-wrap shadow-md py-1 px-3 ring-1 ring-gray-900/10'
                            )}>
                                <p className='text-xs'>{msg.content}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
