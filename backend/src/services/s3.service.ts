import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

// Client public : génère des URLs accessibles depuis le navigateur
const s3Public = new S3Client({
    region: process.env.MINIO_REGION ?? "us-east-1",
    endpoint: process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT ?? "http://localhost:9000",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? "",
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? "",
    },
});

const BUCKET = process.env.MINIO_BUCKET_NAME ?? "marsai";
const FOLDER = process.env.MINIO_FOLDER ?? "grp1";

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

    const publicBase =
        process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT ?? "http://localhost:9000";
    return `${publicBase}/${BUCKET}/${key}`;
}

export async function deleteFileFromS3(key: string): Promise<void> {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

export async function getPresignedVideoUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    return getSignedUrl(s3Public, command, { expiresIn });
}

// Extract S3 key from a full URL (e.g. https://s3.fr-par.scw.cloud/tln/grp1/foo.mp4 → grp1/foo.mp4)
export function extractS3Key(url: string): string | null {
    try {
        const parsed = new URL(url);
        // pathname = /<bucket>/<key>
        const parts = parsed.pathname.split("/").filter(Boolean);
        // parts[0] is bucket, rest is key
        if (parts.length < 2) return null;
        return parts.slice(1).join("/");
    } catch {
        return null;
    }
}

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

export interface S3VideoItem {
    key: string;
    url: string;
    filename: string;
    dossierNum: string | null; // extrait du nom de fichier : MAI-2026-XXXXX
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
            // Structure : grp1/MAI-2026-XXXXX/video-nomoriginal.ext
            const segments = obj.Key.split("/");
            const dossierMatch =
                segments[segments.length - 2]?.match(/^(MAI-\d{4}-\d{5})$/i) ?? null;

            const publicBase =
                process.env.MINIO_PUBLIC_URL ??
                process.env.MINIO_ENDPOINT ??
                "http://localhost:9000";
            videos.push({
                key: obj.Key,
                url: `${publicBase}/${BUCKET}/${obj.Key}`,
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
