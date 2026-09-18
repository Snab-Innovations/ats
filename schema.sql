-- =========================================================================
-- EXPERTHIRE ATS: MULTI-TENANT POSTGRESQL SCHEMA FOR 1,000+ COMPANIES
-- Compatible with Supabase, AWS RDS PostgreSQL, Neon & Cloudflare R2
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES (EMPLOYER TENANTS)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    headquarters VARCHAR(255) DEFAULT 'Bengaluru, India',
    city VARCHAR(100) DEFAULT 'Bengaluru',
    tagline TEXT,
    brand_color VARCHAR(30) DEFAULT '#4f46e5',
    accent_color VARCHAR(30) DEFAULT '#06b6d4',
    logo_url TEXT,
    logo_initials VARCHAR(10) DEFAULT 'CO',
    cover_banner_url TEXT,
    status VARCHAR(50) DEFAULT 'Active',
    plan VARCHAR(100) DEFAULT 'Enterprise Scale Tier',
    primary_admin VARCHAR(255) NOT NULL,
    admin_password TEXT DEFAULT 'Company#2026!',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- 2. COMPANY USERS (RECRUITERS, MANAGERS, INTERVIEWERS)
CREATE TABLE IF NOT EXISTS company_users (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Lead Tech Recruiter',
    department VARCHAR(100) DEFAULT 'Engineering',
    status VARCHAR(50) DEFAULT 'Active',
    last_login VARCHAR(100) DEFAULT 'Just Now',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_company_users_company ON company_users(company_id);
CREATE INDEX IF NOT EXISTS idx_company_users_email ON company_users(email);

-- 3. PLACEMENT AGENCIES (HEADHUNTERS & CONSULTANCIES)
CREATE TABLE IF NOT EXISTS agencies (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    portal_code VARCHAR(100) UNIQUE NOT NULL,
    city VARCHAR(100) DEFAULT 'Bengaluru',
    tier VARCHAR(100) DEFAULT 'Elite Partner',
    primary_contact VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    specialization VARCHAR(255) DEFAULT 'Distributed Systems & Cloud',
    commission_tier VARCHAR(100) DEFAULT '8.33% [1 Month CTC]',
    status VARCHAR(50) DEFAULT 'active',
    portal_password TEXT DEFAULT 'Agency#2026!',
    candidates_submitted INTEGER DEFAULT 0,
    placements_hired INTEGER DEFAULT 0,
    bounties_claimed NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agencies_code ON agencies(portal_code);
CREATE INDEX IF NOT EXISTS idx_agencies_status ON agencies(status);

-- 4. JOBS (REQUISITIONS & MANDATES)
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Full-time',
    format VARCHAR(50) DEFAULT 'In-Office',
    experience VARCHAR(50) DEFAULT '3-5 Yrs',
    education VARCHAR(100) DEFAULT 'B.Tech / B.E.',
    ctc_range VARCHAR(100) DEFAULT '₹25 - ₹40 LPA',
    status VARCHAR(50) DEFAULT 'active',
    description TEXT,
    requirements JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    bounty VARCHAR(100) DEFAULT '₹1.5 Lakhs',
    commission_rate VARCHAR(50) DEFAULT '8.5%',
    agency_dispatched BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_dept ON jobs(department);

-- 5. CANDIDATES & APPLICATIONS
CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    current_company VARCHAR(255),
    experience VARCHAR(50) DEFAULT '0 Yrs',
    current_ctc VARCHAR(50) DEFAULT '₹0 LPA',
    expected_ctc VARCHAR(50) DEFAULT '₹0 LPA',
    notice_period VARCHAR(50) DEFAULT '30 Days',
    education VARCHAR(100),
    college VARCHAR(255),
    skills JSONB DEFAULT '[]'::jsonb,
    stage VARCHAR(50) DEFAULT 'applied',
    source VARCHAR(50) DEFAULT 'direct',
    agency_id TEXT REFERENCES agencies(id) ON DELETE SET NULL,
    resume_url TEXT,
    resume_file_name VARCHAR(255),
    pitch TEXT,
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidates_company_job ON candidates(company_id, job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_agency ON candidates(agency_id);

-- 6. RESUME STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public download policy
CREATE POLICY "Public Read Resumes" ON storage.objects
FOR SELECT USING (bucket_id = 'resumes');

-- Storage authenticated/anon upload policy
CREATE POLICY "Allow Public Resume Uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes');

-- 7. ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT ISOLATION
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write for prototype and public career portal
CREATE POLICY "Public Access Companies" ON companies FOR ALL USING (true);
CREATE POLICY "Public Access Company Users" ON company_users FOR ALL USING (true);
CREATE POLICY "Public Access Agencies" ON agencies FOR ALL USING (true);
CREATE POLICY "Public Access Jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Public Access Candidates" ON candidates FOR ALL USING (true);

-- 8. PRE-POPULATED INITIAL SEED DATA
INSERT INTO companies (id, name, domain, headquarters, city, tagline, brand_color, accent_color, logo_url, logo_initials, cover_banner_url, status, plan, primary_admin, admin_password)
VALUES 
('comp-bharat-101', 'BharatScale Cloud', 'bharatscale.in', 'Bengaluru (HSR Layout) & Mumbai Hub', 'Bengaluru', 'Next-Gen Cloud Infrastructure & High-Scale AI Runtime for India & Global Enterprises', '#4f46e5', '#06b6d4', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80', 'BS', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80', 'Active', 'Enterprise Scale Tier', 'vikram@bharatscale.in', 'BharatScale#2026!'),
('comp-zepto-102', 'ZeptoLabs India', 'zeptolabs.in', 'Bengaluru (Koramangala) & Mumbai Tech Park', 'Bengaluru', '10-Minute Dark Store Logistics & Ultra-Fast Commerce Network', '#db2777', '#f59e0b', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&auto=format&fit=crop&q=80', 'ZL', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80', 'Active', 'Hypergrowth Tier', 'hr@zeptolabs.in', 'Zepto#2026!'),
('comp-razor-103', 'Razorpay Infra', 'razorinfra.com', 'Bengaluru (Indiranagar) & CyberCity Gurugram', 'Bengaluru', 'Autonomous Payment Rail & Neobanking Developer Cloud', '#0284c7', '#10b981', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80', 'RI', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80', 'Active', 'Enterprise Scale Tier', 'talent@razorinfra.com', 'Razor#2026!')
ON CONFLICT (id) DO NOTHING;

INSERT INTO agencies (id, name, portal_code, city, tier, primary_contact, email, phone, specialization, commission_tier, status, portal_password, candidates_submitted, placements_hired, bounties_claimed)
VALUES
('agy-1', 'Naukri Elite Talent Partners', 'NAUKRI-ELITE-BLR', 'Bengaluru', 'Elite Partner', 'Vikas Malhotra', 'vikas.malhotra@naukrielite.in', '+91 98201 55432', 'Distributed Systems & Cloud', '8.33% [1 Month CTC]', 'active', 'Naukri#2026!', 16, 3, 450000),
('agy-2', 'ABC Consultants Tech Practice', 'ABC-INDIA-MUM', 'Mumbai & Gurugram', 'Elite Partner', 'Ritu Sengupta', 'ritu.sengupta@abcconsultants.in', '+91 98450 77123', 'Fintech Infrastructure & Payment Rails', '8.50% [Standard Retainer]', 'active', 'Abc#2026!', 11, 2, 320000),
('agy-3', 'SutraHR Executive Search', 'SUTRA-TECH-PUN', 'Pune & Bengaluru', 'Elite Partner', 'Waqar Sheikh', 'waqar@sutrahr.in', '+91 97112 88401', 'High-Scale Mobile Apps & AI Engineering', '9.00% [Tech Specialist]', 'active', 'Sutra#2026!', 6, 1, 180000)
ON CONFLICT (id) DO NOTHING;
