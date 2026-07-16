import { getCurrentUser } from '@/lib/auth/middleware';
import { getUserProfile } from '@/lib/auth/user-profiles';
import { generateInviteToken, sendInviteEmail } from '@/lib/auth/invitations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await getUserProfile(user.id);
    if (!profile || !['admin', 'director'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden - only admin/director can send invites' }, { status: 403 });
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });
    }

    if (!['sales_rep', 'ops', 'director'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Generate invite token
    const token = await generateInviteToken(email, role);

    // Build invite URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/auth/accept-invite?token=${token}`;

    // Send email
    await sendInviteEmail(email, inviteUrl);

    return NextResponse.json({
      success: true,
      message: `Invite sent to ${email}`,
      inviteUrl, // For testing
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
