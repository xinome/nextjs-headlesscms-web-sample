// microCMS API クライアント（microcms-js-sdk版）

import { createClient } from 'microcms-js-sdk'

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN
const apiKey = process.env.MICROCMS_API_KEY

if (!serviceDomain) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is not set')
}

if (!apiKey) {
  throw new Error('MICROCMS_API_KEY is not set')
}

// Next.js App Router 環境でサーバーサイド専用利用を想定
export const microcmsClient = createClient({
  serviceDomain,
  apiKey,
})
