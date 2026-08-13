import PasswordRecoveryForm from '../components/PasswordRecoveryForm'
import PageIntro from '../components/PageIntro'

export const metadata = { title: 'Set or reset password' }

export default function ForgotPasswordPage() {
  return <>
    <PageIntro eyebrow="Account access" title="Set or reset your password">
      <p>We will email you a secure link to choose a new password.</p>
    </PageIntro>
    <section className="salon-wrap salon-section"><PasswordRecoveryForm /></section>
  </>
}
