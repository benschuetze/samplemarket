import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("supabase url: ", supabaseUrl);
console.log("supabaseKey: ", supabaseKey);
export const supabase = createClient(supabaseUrl, supabaseKey);
