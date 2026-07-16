import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export interface InvitationToken {
  token: string;
  email: string;
  role: 'sales_rep' | 'ops' | 'director' | 'admin';
  expires_at: string;
  created_at: string;
}

// Store invitations in-memory (in production, use a DB table)
const invitations = new Map<string, InvitationToken>();

export async function generateInviteToken(
  email: string,
  role: 'sales_rep' | 'ops' | 'director' | 'admin'
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  invitations.set(token, {
    token,
    email,
    role,
    expires_at: expiresAt.toISOString(),
    created_at: new Date().toISOString(),
  });

  return token;
}

export async function validateInviteToken(token: string): Promise<InvitationToken | null> {
  const invitation = invitations.get(token);
  
  if (!invitation) return null;
  if (new Date(invitation.expires_at) < new Date()) {
    invitations.delete(token);
    return null;
  }

  return invitation;
}

export async function consumeInviteToken(token: string): Promise<void> {
  invitations.delete(token);
}

export async function sendInviteEmail(email: string, inviteUrl: string): Promise<void> {
  // In production, use Resend:
  // const { error } = await resend.emails.send({
  //   from: "noreply@arusinovasi.com",
  //   to: email,
  //   subject: "Join ArusInovasi CRM",
  //   html: `Click here to accept invite: ${inviteUrl}`
  // });

  console.log(`[EMAIL] Invite sent to ${email}: ${inviteUrl}`);
}
