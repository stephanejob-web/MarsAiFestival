import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

// Client interne : upload, delete, list (réseau Docker interne)
const s3 = new S3Client({
    region: process.env.MINIO_REGION ?? "us-east-1",
    endpoint: process.env.MINIO_ENDPOINT ?? "http://minio:9000",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? "",
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? "",
    },
});

const BUCKET = process.env.MINIO_BUCKET_NAME ?? "marsai";
const FOLDER = process.env.MINIO_FOLDER ?? "grp1";

function publicUrl(key: string): string {
    const base =
        process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT ?? "http://localhost:9000";
    return `${base}/${BUCKET}/${key}`;
}

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

    return publicUrl(key);
}

export async function deleteFileFromS3(key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

// Le bucket est public (anonymous download) — URL directe sans signature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getPresignedVideoUrl(key: string, _expiresIn = 3600): Promise<string> {
    return publicUrl(key);
}

// Extrait la clé MinIO depuis une URL stockée en base
// Cherche le nom du bucket dans le chemin et retourne tout ce qui suit
export function extractS3Key(url: string): string | null {
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        const bucketIndex = parts.indexOf(BUCKET);
        if (bucketIndex === -1 || bucketIndex >= parts.length - 1) return null;
        return parts.slice(bucketIndex + 1).join("/");
    } catch {
        return null;
    }
}

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

export interface S3VideoItem {
    key: string;
    url: string;
    filename: string;
    dossierNum: string | null;
    sizeBytes: number;
    lastModified: Date;
}

export async function listVideosFromS3(): Promise<S3VideoItem[]> {
    const videos: S3VideoItem[] = [];
    let continuationToken: string | undefined;

    do {
        const response = await s3.send(
            new ListObjectsV2Command({
                Bucket: BUCKET,
                Prefix: `${FOLDER}/`,
                ContinuationToken: continuationToken,
            }),
        );

        for (const obj of response.Contents ?? []) {
            if (!obj.Key || !obj.Size || !obj.LastModified) continue;

            const lowerKey = obj.Key.toLowerCase();
            if (!VIDEO_EXTENSIONS.some((ext) => lowerKey.endsWith(ext))) continue;

            const filename = obj.Key.split("/").pop() ?? obj.Key;
            const segments = obj.Key.split("/");
            const dossierMatch =
                segments[segments.length - 2]?.match(/^(MAI-\d{4}-\d{5})$/i) ?? null;

            videos.push({
                key: obj.Key,
                url: publicUrl(obj.Key),
                filename,
                dossierNum: dossierMatch ? dossierMatch[1].toUpperCase() : null,
                sizeBytes: obj.Size,
                lastModified: obj.LastModified,
            });
        }

        continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return videos;
}
