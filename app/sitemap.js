const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://lo-chan-hair-bristol.vercel.app'
const routes=['/','/services','/booking','/gallery','/about','/location','/contact','/terms','/privacy']
export default function sitemap(){return routes.map((path,index)=>({url:`${siteUrl}${path}`,lastModified:new Date(),changeFrequency:index<4?'weekly':'monthly',priority:path==='/'?1:.7}))}
