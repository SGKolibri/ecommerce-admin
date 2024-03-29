import multiparty from 'multiparty'
import { resolve } from 'styled-jsx/css'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import mime from 'mime-types'
import fs from 'fs'

export default async function handle(req, res) {
    const form = new multiparty.Form()

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, async (error, fields, files) => {
            if (error) return reject(error)
            resolve({ fields, files })
        });
    });

    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })

    const links = []
    for (const file of files.files) {
        const ext = file.originalFilename.split('.').pop()
        const newFilename = Date.now() + '.' + ext
        await client.send(new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: newFilename,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path)
        }));
        const link = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${newFilename}`
        links.push(link)
    }
    return res.json({ links })
}

export const config = {
    api: {
        bodyParser: false,
    },
}