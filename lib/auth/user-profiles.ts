import { createClient } from '@/lib/supabase/server';

export type UserRole = 'sales_rep' | 'ops' | 'director' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  team?: string;
  is_active: boolean;
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createUserProfile(
  userId: string,
  email: string,
  name: string,
  role: UserRole = 'sales_rep'
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email,
      name,
      role,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user role:', error);
    return null;
  }

  return data;
}
