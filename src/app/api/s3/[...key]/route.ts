import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.PORTFOLIO_AWS_REGION ?? "ap-south-1",
  credentials: {
    accessKeyId: process.env.PORTFOLIO_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.PORTFOLIO_AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.PORTFOLIO_S3_BUCKET_NAME ?? "project-cards-for-portfolio";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const objectKey = key.join("/");

  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: objectKey }));
    const body = await res.Body?.transformToByteArray();
    if (!body) return new NextResponse(null, { status: 404 });

    return new NextResponse(Buffer.from(body), {
      headers: {
        "Content-Type": res.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
