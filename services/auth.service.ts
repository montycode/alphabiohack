import { createClient } from "@/lib/supabase/client";

export const getUserStore = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    return data.session?.user ?? null;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
};

export const loginUser = async (email: string, password: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/protected`,
      },
    });
    if (error) throw error;
    return true;
  } catch (error) {
    throw error;
  }
};
