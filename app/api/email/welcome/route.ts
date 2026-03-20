import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email/send'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    const supabase = createAdminClient()

    const { data: user } = await supabase
      .from('users')
      .select('*, charities(name)')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await sendWelcomeEmail(
      user.email,
      user.full_name,
      user.charities?.name || 'your chosen charity'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}