const SUPABASE_URL = "https://nnvbxtjpfpfwegewtnkc.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5udmJ4dGpwZnBmd2VnZXd0bmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDE3NTcsImV4cCI6MjEwMDgxNzc1N30.-2FbxS3SAkvvKUZbBC2kPNR_mMRk4P7vG-kz6eES3G4";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


window.supabase = supabaseClient;
