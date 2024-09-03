import React from 'react'

type Props = {
    pdfUrl?: string
}


export default function PDFViewer({ pdfUrl }: Props) {
    return (
        <iframe src={`https://docs.google.com/gview?url=${pdfUrl}&embedded=true`} className='w-full h-full'>
        </iframe>
    )
}
