import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerClient } from '../../lib/supabase/server'
import SignOutButton from './SignOutButton'
import PageIntro from '../components/PageIntro'

export const metadata={title:'My account'}
export default async function AccountPage(){const db=await getServerClient(),{data:{user}}=await db.auth.getUser();if(!user)redirect('/signin?redirectTo=/account');const [{data:profile},{data:appointments}]=await Promise.all([db.from('profiles').select('*').eq('id',user.id).maybeSingle(),db.from('appointments').select('*,services(name,price,duration_minutes)').eq('user_id',user.id).order('starts_at',{ascending:false})]);return <><PageIntro eyebrow="Customer account" title="My appointments"><p>Signed in as {profile?.full_name||user.email}</p></PageIntro><section className="salon-wrap salon-section"><div className="account-actions"><Link className="salon-button" href="/booking">Book another appointment</Link><SignOutButton /></div><div className="account-appointments">{appointments?.length?appointments.map(row=><article key={row.id}><div><strong>{row.services?.name}</strong><p>{new Date(row.starts_at).toLocaleString('en-GB',{timeZone:'Europe/London',dateStyle:'long',timeStyle:'short'})}</p></div><span className={`status ${row.status}`}>{row.status}</span></article>):<p>You do not have any appointments yet.</p>}</div></section></>}
