'use client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import React, { Children } from 'react'

type Props = {
    children: React.ReactNode
}

const queryClient = new QueryClient()


const Provider = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

export default Provider