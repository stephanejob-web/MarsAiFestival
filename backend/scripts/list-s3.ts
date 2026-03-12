import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const s3 = new S3Client({
    region: process.env.SCALEWAY_REGION ?? "fr-par",
    endpoint: process.env.SCALEWAY_ENDPOINT ?? "https://s3.fr-par.scw.cloud",
    credentials: {
        accessKeyId: process.env.SCALEWAY_ACCESS_KEY ?? "",
        secretAccessKey: process.env.SCALEWAY_SECRET_KEY ?? "",
    },
});

async function listBucket() {
    const res = await s3.send(
        new ListObjectsV2Command({
            Bucket: process.env.SCALEWAY_BUCKET_NAME ?? "tln",
            Prefix: process.env.SCALEWAY_FOLDER ?? "grp1",
        }),
    );

    const objects = res.Contents ?? [];

    if (objects.length === 0) {
        console.log("Bucket vide (ou dossier grp1 vide)");
        return;
    }

    console.log(`\n${objects.length} fichier(s) dans ${process.env.SCALEWAY_BUCKET_NAME}/${process.env.SCALEWAY_FOLDER} :\n`);
    for (const obj of objects) {
        const size = ((obj.Size ?? 0) / 1024).toFixed(1);
        console.log(`  ${obj.Key}  (${size} KB)  — ${obj.LastModified?.toLocaleString()}`);
    }
}

listBucket().catch(console.error);
