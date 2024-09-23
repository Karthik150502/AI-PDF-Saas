import AWS from "aws-sdk";

export async function uploadFileToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,

        })

        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME
            },
            region: 'eu-north-1'
        })

        const file_key = "uploads/" + Date.now().toString() + file.name.replaceAll(" ", "-")

        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        }

        // const upload = s3.putObject(params).on("httpUploadProgess", (evt) => {
        //     console.log("Uploading to s3...", parseInt(((evt.loaded * 100) / evt.total).toString()) + "%");
        // }).promise()
        const upload = s3.putObject(params).on("httpUploadProgess", () => {
            console.log("Uploading to s3...");
        }).promise()

        await upload.then((data) => {
            console.log("File uploaded successfully....")
        })


        return Promise.resolve({
            file_key,
            file_name: file.name
        })
    } catch (error) {

    }
}



export function getS3Url(fileKey: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileKey}`
    return url
}