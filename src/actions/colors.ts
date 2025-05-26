"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

async function getServerSupabase() {
  return await createClient(cookies());
}

export async function getColors() {
  const supabase = await getServerSupabase();
  try {
    const { data, error } = await supabase
      .from("colors")
      .select("id, name, hex_code")
      .order("name");
    if (error) throw new Error(error.message);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching colors: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

export async function createColor(data: { name: string; hex_code: string }) {
  const supabase = await getServerSupabase();
  try {
    const { data: result, error } = await supabase
      .from("colors")
      .insert(data)
      .select("id");
    if (error) throw new Error(error.message);
    return {
      success: true,
      id: result?.[0]?.id,
    };
  } catch (error) {
    console.error("Error creating color: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
