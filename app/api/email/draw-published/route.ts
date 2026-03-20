import { NextResponse } from 'next/server'
import { sendDrawPublishedEmail, sendWinnerEmail } from '@/lib/email/send'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { drawId } = await req.json()
    const supabase = createAdminClient()

    // Get draw details
    const { data: draw } = await supabase
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single()

    if (!draw) {
      return NextResponse.json({ error: 'Draw not found' }, { status: 404 })
    }

    // Get all active subscribers
    const { data: subscribers } = await supabase
      .from('subscriptions')
      .select('user_id, users(email, full_name)')
      .eq('status', 'active')

    if (!subscribers) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    let emailsSent = 0

    for (const sub of subscribers) {
      const user = sub.users as any
      if (!user?.email) continue

      // Send draw published email to everyone
      await sendDrawPublishedEmail(
        user.email,
        user.full_name,
        draw.month,
        draw.numbers
      )
      emailsSent++

      // Check if this user is a winner
      const { data: entry } = await supabase
        .from('draw_entries')
        .select('*')
        .eq('draw_id', drawId)
        .eq('user_id', sub.user_id)
        .single()

      if (entry) {
        // Send winner email
        await sendWinnerEmail(
          user.email,
          user.full_name,
          entry.matched_count,
          entry.prize_amount,
          draw.month
        )
      }
    }

    return NextResponse.json({ success: true, emailsSent })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}