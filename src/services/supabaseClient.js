import { createClient } from "@supabase/supabase-js";

const CONFIG_STORAGE_KEY = "experthire_supabase_config_v1";

/**
 * Retrieve active Supabase credentials from either environment variables
 * or custom settings saved in localStorage by the Super Admin.
 */
export const getSupabaseConfig = () => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          source: "localStorage"
        };
      }
    }
  } catch {
    // ignore
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes("your-project")) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      source: "env"
    };
  }

  return {
    url: "",
    anonKey: "",
    source: "none"
  };
};

export const saveSupabaseConfig = (url, anonKey) => {
  localStorage.setItem(
    CONFIG_STORAGE_KEY,
    JSON.stringify({ url: url.trim(), anonKey: anonKey.trim(), updatedAt: new Date().toISOString() })
  );
  // Re-initialize client
  initSupabase();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  initSupabase();
};

let supabaseInstance = null;

export const initSupabase = () => {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn("Failed to initialize Supabase client:", err);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
  return supabaseInstance;
};

// Initialize immediately
initSupabase();

export const getSupabase = () => {
  if (!supabaseInstance) {
    initSupabase();
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

/**
 * Test live connection to Supabase instance
 */
export const testSupabaseConnection = async () => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: "Supabase credentials are not configured. Please provide Project URL and Anon Public Key."
    };
  }

  try {
    // Perform a lightweight ping query
    const { data, error } = await client.from("companies").select("id").limit(1);
    if (error) {
      // If table doesn't exist yet, it's still connected to Supabase engine
      if (error.code === "42P01") {
        return {
          success: true,
          tableMissing: true,
          message: "Connected to Supabase PostgreSQL, but database tables are not yet created. Please run the SQL schema script!"
        };
      }
      return {
        success: false,
        message: `Connection error: ${error.message} (Code: ${error.code})`
      };
    }

    return {
      success: true,
      tableMissing: false,
      message: "Successfully connected to live Supabase PostgreSQL database!",
      count: data?.length || 0
    };
  } catch (err) {
    return {
      success: false,
      message: `Network error reaching Supabase: ${err.message}`
    };
  }
};
