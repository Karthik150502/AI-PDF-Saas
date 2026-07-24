import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 400 });
        }

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.S3_BUCKET_NAME
            },
            region: 'eu-north-1'
        });

        const file_key = "uploads/" + Date.now().toString() + file.name.replaceAll(" ", "-");
        const body = Buffer.from(await file.arrayBuffer());

        await s3.putObject({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: file_key,
            Body: body,
            ContentType: file.type,
        }).promise();

        return NextResponse.json({ file_key, file_name: file.name });
    } catch (error) {
        console.log("Error uploading to S3", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
