import { supabase } from '../lib/supabase';

/**
 * মাদরাসার লোগো আপডেট করার ফাংশন
 * @param newLogoUrl - নতুন লোগোর URL
 */
export const updateMadrasaLogo = async (newLogoUrl: string) => {
  try {
    const { data, error } = await supabase
      .from('Madrasa_Logo')
      .update({ 
        logo_url: newLogoUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating logo:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * নতুন ছাত্রের ফলাফল যোগ করার ফাংশন
 * @param resultData - ছাত্রের তথ্যের অবজেক্ট
 */
export const addStudentResult = async (resultData: {
  student_name: string;
  roll_no: string;
  marks: any;
  total_marks: number;
  exam_name: string;
  year: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('Results')
      .insert([resultData])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error adding result:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * বিদ্যমান ফলাফল আপডেট করার ফাংশন
 * @param id - রেজাল্টের UUID
 * @param updatedData - আপডেটেড তথ্যের অবজেক্ট
 */
export const updateStudentResult = async (id: string, updatedData: any) => {
  try {
    const { data, error } = await supabase
      .from('Results')
      .update(updatedData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error updating result:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * সকল ফলাফল নিয়ে আসার ফাংশন
 */
export const fetchAllResults = async () => {
  try {
    const { data, error } = await supabase
      .from('Results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching results:', error.message);
    return { success: false, error: error.message };
  }
};
