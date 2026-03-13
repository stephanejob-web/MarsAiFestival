import { google } from "googleapis";
import { Readable } from "stream";

export async function uploadVideoToYoutube(
    buffer: Buffer,
    title: string,
    description: string,
    mimeType: string,
): Promise<string> {
    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        "http://localhost:5500/oauth2callback",
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });

    const response = await youtube.videos.insert({
        part: ["snippet", "status"],
        requestBody: {
            snippet: {
                title,
                description,
                categoryId: "24", // Entertainment
            },
            status: {
                privacyStatus: "private",
            },
        },
        media: {
            mimeType,
            body: Readable.from(buffer),
        },
    });

    const videoId = response.data.id;
    if (!videoId) throw new Error("YouTube n'a pas retourné d'ID vidéo");

    return `https://www.youtube.com/watch?v=${videoId}`;
}
