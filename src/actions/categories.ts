"use server";

import { createClient } from "@/utils/supabase/server";

async function getServerSupabase() {
  return await createClient();
}

export async function getCategories() {
  const supabase = await getServerSupabase();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description")
      .order("name");
    if (error) throw new Error(error.message);
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching categories: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

export async function createCategory(data: {
  name: string;
  description?: string;
  parent_id?: string;
}) {
  const supabase = await getServerSupabase();
  const slug = data.name
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-");
  try {
    const { data: result, error } = await supabase
      .from("categories")
      .insert({ ...data, slug })
      .select("id");
    if (error) throw new Error(error.message);
    return {
      success: true,
      id: result?.[0]?.id,
    };
  } catch (error) {
    console.error("Error creating category: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCategoryRelation() {
  const supabase = await getServerSupabase();
  try {
    const { data, error } = await supabase.from("product_categories").select(
      `
      product_groups_id(id, name),
      category_id(id, name)  
      `
    );
    if (error) throw new Error(error.message);
    // console.log("Data from categoryRelation: ", data);
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}
