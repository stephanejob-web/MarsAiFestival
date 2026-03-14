import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
            // Pattern attendu : MAI-2026-XXXXX-video-nomoriginal.ext
            const dossierMatch = filename.match(/^(MAI-\d{4}-\d{5})/i);

            videos.push({
                key: obj.Key,
                url: `${process.env.SCALEWAY_ENDPOINT}/${BUCKET}/${obj.Key}`,
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
