import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { text, voice } = req.body;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": process.env.NEXT_ELEVEN_API_KEY || "",
        },
        body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
            },
        }),
    });

    if (response.ok) {
        const audioBlob = await response.blob();
        const buffer = await audioBlob.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.send(Buffer.from(buffer));
    } else {
        res.status(response.status).json({ error: 'Failed to fetch audio from Eleven Labs' });
    }
}