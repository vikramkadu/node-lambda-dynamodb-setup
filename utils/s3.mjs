import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.REGION });

export const generatePresignedUrl = async ( objectKey, expiresIn = 36000) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.BUCKETNAME,
            Key: objectKey,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return presignedUrl;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw new Error('Could not generate presigned URL');
    }
};
