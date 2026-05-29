import { NextResponse } from 'next/server'
import { loadAdminSettingsContext } from '../_context'

const text = (value) => JSON.parse(`"${value}"`)

const IMPORTANT_SETTING_KEYS = [
  'shop_name',
  'site_url',
  'seo_title',
  'seo_description',
  'address',
  'phone',
  'whatsapp',
  'google_map_url',
  'business_hours',
  'api_environment',
  'api_stripe_webhook_endpoint',
]

export async function GET() {
  try {
    const context = await loadAdminSettingsContext()
    if (context.error) return NextResponse.json({ error: context.error }, { status: context.status })

    const { data, error } = await context.serviceSupabase.from('settings').select('key,value')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const settings = (data || []).reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})

    const settingChecks = IMPORTANT_SETTING_KEYS.map((key) => ({
      id: `setting_${key}`,
      label: key,
      status: settings[key] ? 'pass' : 'warning',
      detail: settings[key] ? text('\\u5df2\\u586b\\u5beb') : text('\\u5f85\\u88dc\\u8cc7\\u6599'),
    }))

    const paymentChecks = [
      {
        id: 'payment_stripe',
        label: 'Stripe',
        status: settings.stripe_enabled !== 'true' ? 'warning' : process.env.STRIPE_SECRET_KEY ? 'pass' : 'warning',
        detail:
          settings.stripe_enabled !== 'true'
            ? text('\\u672a\\u555f\\u7528\\u6216\\u5f85\\u78ba\\u8a8d')
            : process.env.STRIPE_SECRET_KEY
              ? text('\\u5df2\\u555f\\u7528\\uff0cCheckout secret \\u5df2\\u5b58\\u5728 Vercel/server env')
              : text('Stripe \\u5df2\\u5728\\u5f8c\\u53f0\\u555f\\u7528\\uff0c\\u4f46 Vercel/server env \\u672a\\u8a2d STRIPE_SECRET_KEY\\uff0c\\u524d\\u53f0\\u6703\\u6539\\u7528\\u4eba\\u5de5\\u4ed8\\u6b3e'),
      },
      {
        id: 'payment_stripe_webhook',
        label: 'Stripe Webhook',
        status: process.env.STRIPE_WEBHOOK_SECRET ? 'pass' : 'warning',
        detail: process.env.STRIPE_WEBHOOK_SECRET
          ? text('Webhook secret \\u5df2\\u5b58\\u5728 server env')
          : text('\\u5f85\\u5728 Vercel \\u8a2d\\u5b9a STRIPE_WEBHOOK_SECRET\\uff0cendpoint: https://pandora-spa.vercel.app/api/stripe/webhook'),
      },
      {
        id: 'payment_manual',
        label: text('\\u4eba\\u5de5\\u78ba\\u8a8d\\u4ed8\\u6b3e'),
        status: settings.manual_payment_enabled !== 'false' ? 'pass' : 'warning',
        detail: settings.manual_payment_enabled !== 'false' ? text('\\u5df2\\u4fdd\\u7559\\u5f8c\\u5099\\u4ed8\\u6b3e') : text('\\u5df2\\u505c\\u7528'),
      },
    ]

    const apiChecks = [
      {
        id: 'api_supabase_env',
        label: 'Supabase Env',
        status: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY ? 'pass' : 'fail',
        detail: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY
          ? text('Supabase URL、Anon Key、Service Role 已存在 server env')
          : text('Vercel/server env 必須填入 NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY、SUPABASE_SERVICE_ROLE_KEY'),
      },
      {
        id: 'api_rate_limit_backend',
        label: 'Production Rate Limit',
        status: process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? 'pass' : 'warning',
        detail: process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
          ? text('Upstash Redis / Vercel KV rate limit 已可跨 instance 使用')
          : text('目前會使用 memory fallback；正式收錢網站建議在 Vercel env 加 UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN'),
      },
      {
        id: 'api_secret_policy',
        label: text('Secret 存放政策'),
        status: 'pass',
        detail: text('Stripe secret、Webhook secret、Supabase service role、Upstash token 只應放 Vercel/server env，不會由 public settings 回傳'),
      },
    ]

    const checks = [...settingChecks, ...paymentChecks, ...apiChecks]
    const summary = {
      pass: checks.filter((item) => item.status === 'pass').length,
      warning: checks.filter((item) => item.status === 'warning').length,
      fail: checks.filter((item) => item.status === 'fail').length,
    }

    return NextResponse.json({ success: true, summary, checks }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}
