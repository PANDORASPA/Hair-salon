import { Suspense } from 'react'
import AuthForm from '../components/AuthForm'
import PageIntro from '../components/PageIntro'
export const metadata = { title: 'Sign in' }
export default function SignInPage(){ return <><PageIntro eyebrow="Customer account" title="Sign in" /><section className="salon-wrap salon-section"><Suspense><AuthForm /></Suspense></section></> }
