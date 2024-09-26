'use client'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface DocumentPreviewProps {
    documentUrl: string
}

export default function DocumentPreview({ documentUrl }: DocumentPreviewProps) {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
    }, [documentUrl])

    const handleIframeLoad = () => {
        setIsLoading(false)
    }

    return (
        <div className="w-full h-full relative bg-gray-900 rounded-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            )}
            {documentUrl ? (
                <iframe
                    src={`https://docs.google.com/gview?url=${documentUrl}&embedded=true`}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    title="Document Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 p-4">
                    <p>No document loaded. Please upload a document to preview.</p>
                </div>
            )}
        </div>
    )
}