import { NextResponse } from 'next/server'
import cloudinary, { isCloudinaryConfigured } from '@/lib/cloudinary'
import { auth } from '@/auth'
import type { UploadApiResponse } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Add credentials to .env first.' },
      { status: 503 }
    )
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string) || 'image'

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const folder = type === 'video' ? 'northline/videos' : 'northline/products'
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: type === 'video' ? 'video' : 'image',
          ...(type !== 'video' && {
            transformation: [
              { width: 1000, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' },
            ],
          }),
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error)
          else resolve(uploaded)
        }
      )
      stream.end(buffer)
    })

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
