export function getS3Url(fileKey: string) {
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${fileKey}`
    return url
}