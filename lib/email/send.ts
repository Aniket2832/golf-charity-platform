import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Golf Charity Platform <onboarding@resend.dev>'

export async function sendWelcomeEmail(
  toEmail: string,
  userName: string,
  charityName: string
) {
  try {
    const { welcomeEmail } = await import('./templates')
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: 'Welcome to Golf Charity Platform!',
      html: welcomeEmail(userName, charityName)
    })
    console.log('Welcome email sent to:', toEmail)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendDrawPublishedEmail(
  toEmail: string,
  userName: string,
  drawMonth: string,
  numbers: number[]
) {
  try {
    const { drawPublishedEmail } = await import('./templates')
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Draw Results — ${drawMonth} are in!`,
      html: drawPublishedEmail(userName, drawMonth, numbers)
    })
    console.log('Draw email sent to:', toEmail)
  } catch (error) {
    console.error('Failed to send draw email:', error)
  }
}

export async function sendWinnerEmail(
  toEmail: string,
  userName: string,
  matchCount: number,
  prizeAmount: number,
  drawMonth: string
) {
  try {
    const { winnerEmail } = await import('./templates')
    await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `You won £${prizeAmount.toFixed(2)} in the ${drawMonth} draw!`,
      html: winnerEmail(userName, matchCount, prizeAmount, drawMonth)
    })
    console.log('Winner email sent to:', toEmail)
  } catch (error) {
    console.error('Failed to send winner email:', error)
  }
}