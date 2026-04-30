import { NextResponse } from 'next/server'
import { getServerClient } from '../../../../lib/supabase/server'
import { getServiceClient } from '../../../../lib/supabase/service'

export const runtime = 'nodejs'

const BUCKET = 'service-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const safeName = (name = 'service-image') =>
  String(name)
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'service-image'

const extensionFor = (file) => {
  const byType = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  const typeExt = byType[file.type]
  if (typeExt) return typeExt
  const match = String(file.name || '').match(/\.([a-z0-9]+)$/i)
  return match?.[1]?.toLowerCase() || 'jpg'
}

const loadAdminRequestContext = async () => {
  const authSupabase = getServerClient()
  const {
    data: { user },
    error: userError,
  } = await authSupabase.auth.getUser()

  if (userError || !user?.id) {
    return { error: userError?.message || 'Unauthorized', status: 401, serviceSupabase: null }
  }

  const serviceSupabase = getServiceClient()
  const { data: profile, error: profileError } = await serviceSupabase
    .from('member_profiles')
    .select('id,is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    return { error: profileError.message, status: 500, serviceSupabase: null }
  }

  if (!profile?.is_admin) {
    return { error: 'Forbidden', status: 403, serviceSupabase: null }
  }

  return { error: null, status: 200, serviceSupabase }
}

const ensureBucket = async (serviceSupabase) => {
  const { data, error } = await serviceSupabase.storage.getBucket(BUCKET)
  if (data && !error) return

  const { error: createError } = await serviceSupabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_FILE_SIZE,
    allowedMimeTypes: [...ALLOWED_TYPES],
  })

  if (createError && !String(createError.message || '').toLowerCase().includes('already exists')) {
    throw createError
  }
}

export async function POST(request) {
  try {
    const context = await loadAdminRequestContext()
    if (context.error) {
      return NextResponse.json({ error: context.error }, { status: context.status })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ error: '請先選擇圖片檔案' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: '只支援 JPG、PNG、WEBP 或 GIF 圖片' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '圖片不可大於 5MB' }, { status: 400 })
    }

    await ensureBucket(context.serviceSupabase)

    const ext = extensionFor(file)
    const base = safeName(formData.get('serviceName') || file.name)
    const path = `services/${Date.now()}-${base}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await context.serviceSupabase.storage.from(BUCKET).upload(path, buffer, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      throw uploadError
    }

    const { data } = context.serviceSupabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ success: true, url: data.publicUrl, path }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error?.message || '圖片上載失敗' }, { status: 500 })
  }
}
