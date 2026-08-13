import PasswordResetForm from '../components/PasswordResetForm'
import PageIntro from '../components/PageIntro'

export const metadata = { title: 'Choose a new password' }

export default function ResetPasswordPage() {
  return <>
    <PageIntro eyebrow="Account access" title="Choose a new password">
      <p>Use at least eight characters. Your password is sent securely to our authentication provider.</p>
    </PageIntro>
    <section className="salon-wrap salon-section"><PasswordResetForm /></section>
  </>
}
