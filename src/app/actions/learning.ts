"use server";

import { supabase } from "@/lib/supabase";

export async function saveUserPreference(userId: string, job: any, swipeType: 'like' | 'pass') {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        company_name: job.company,
        job_role: job.role,
        tags: job.tags,
        swipe_type: swipeType
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Learning Engine Error:", error);
    return { success: false };
  }
}

export async function getUserInsights(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('job_role, tags, swipe_type')
      .eq('user_id', userId)
      .eq('swipe_type', 'like')
      .limit(20);

    if (error) throw error;

    // This data can be fed back into the AI prompt to "train" it on preferences
    return data;
  } catch (error) {
    return [];
  }
}
