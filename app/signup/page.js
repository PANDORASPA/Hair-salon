import { Suspense } from 'react'
import AuthForm from '../components/AuthForm'
import PageIntro from '../components/PageIntro'
export const metadata = { title: 'Create account' }
export default function SignUpPage(){ return <><PageIntro eyebrow="Customer account" title="Create an account" /><section className="salon-wrap salon-section"><Suspense><AuthForm mode="signup" /></Suspense></section></> }
