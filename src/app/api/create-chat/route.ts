import { db } from "@/lib/db";
import { chat } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";




export async function POST(req: Request, res: Response) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({
            error: "Unauthorized"
        }, { status: 401 })
    }
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log("File key and file name from the API callout")
        console.log(file_key, file_name)
        await loadS3IntoPinecone(file_key)

        const chatid = await db.insert(chat).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId,
        }).returning({
            insertedId: chat.id
        })

        return NextResponse.json({ chat_id: chatid[0].insertedId }, { status: 200 })


        // return NextResponse.json({ message: "Successly uploaded." })

    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}