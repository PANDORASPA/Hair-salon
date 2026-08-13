import { Suspense } from 'react'
import AuthForm from '../../components/AuthForm'
import PageIntro from '../../components/PageIntro'
export const metadata = { title: 'Admin sign in' }
export default function AdminLoginPage(){ return <><PageIntro eyebrow="Admin access" title="Sign in"><p>Manage Salon Poke appointments, services, schedule, gallery and site content.</p></PageIntro><section className="salon-wrap salon-section"><Suspense><AuthForm admin /></Suspense></section></> }
