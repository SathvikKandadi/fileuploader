import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { Readable } from "stream";


dotenv.config();


const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;
const region = process.env.AWS_BUCKET_REGION as string;
const bucket = process.env.AWS_BUCKET_NAME as string;

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

export async function getObjectURL(key: string) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: `uploads/user-uploads/${key}`
    })
    const preSignedURL = await getSignedUrl(s3Client, command);
    return preSignedURL;
}

export async function putObjectURL(filename: string) {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: `uploads/user-uploads/${filename}`,
    })

    const preSignedURL = await getSignedUrl(s3Client, command);
    return preSignedURL;

}

export async function downloadFile(filename: string) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: `uploads/user-uploads/${filename}`
    })
    const response = await s3Client.send(command)
    const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    };

    const encryptedContent = await streamToBuffer(response.Body as Readable);
    console.log(`Encrypted Content: ${encryptedContent}`);
    return encryptedContent;
}

export async function uploadFile(fileBuffer: any, filename: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: `uploads/user-uploads/${filename}`,
        ContentType: contentType,
        Body: fileBuffer
    })
    return s3Client.send(command);
}

export async function deleteFile(key: string): Promise<void> {
    try {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: `uploads/user-uploads/${key}`
        });

       await s3Client.send(command);
    } catch (error) {
        throw new Error(`Failed to delete file: ${(error as Error).message}`);
    }
}