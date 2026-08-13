'use client'
import Link from 'next/link'
import { useState } from 'react'
import { getBrowserClient } from '../../lib/supabase/browser'
import { AdministratorsModule,AppointmentsModule,GalleryModule,ScheduleModule,ServicesModule,SiteContentModule } from '../components/admin/SalonAdminModules'

const tabs=[['appointments','Appointments'],['services','Services & prices'],['schedule','Schedule'],['gallery','Gallery'],['site-content','Site content'],['administrators','Administrators']]
const panels={appointments:AppointmentsModule,services:ServicesModule,schedule:ScheduleModule,gallery:GalleryModule,'site-content':SiteContentModule,administrators:AdministratorsModule}
export default function AdminShell({email}){const [active,setActive]=useState('appointments'),Panel=panels[active];const signOut=async()=>{await getBrowserClient().auth.signOut();location.assign('/admin/login')};return <div className="salon-admin"><header><div><small>Salon Poke Bristol</small><h1>Admin</h1></div><div><span>{email}</span><Link href="/">View site</Link><button onClick={signOut}>Sign out</button></div></header><div className="salon-admin-workspace"><aside>{tabs.map(([id,label])=><button className={active===id?'active':''} key={id} onClick={()=>setActive(id)}>{label}</button>)}</aside><section><Panel /></section></div></div>}
