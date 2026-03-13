import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.SCALEWAY_REGION ?? "fr-par",
    endpoint: process.env.SCALEWAY_ENDPOINT ?? "https://s3.fr-par.scw.cloud",
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY ?? "",
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY ?? "",
    },
});

const BUCKET = process.env.SCALEWAY_BUCKET_NAME ?? "tln";
const FOLDER = process.env.SCALEWAY_FOLDER ?? "grp1";

export async function uploadFileToS3(
    buffer: Buffer,
    filename: string,
    mimetype: string,
    publicRead = false,
): Promise<string> {
    const key = `${FOLDER}/${filename}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            ...(publicRead && { ACL: "public-read" }),
        }),
    );

    return `${process.env.SCALEWAY_ENDPOINT}/${BUCKET}/${key}`;
}
