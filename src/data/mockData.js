// ExpertHire ATS - Enterprise Tech Ecosystem Dataset

export const COVER_PRESETS = [
  {
    id: "preset-campus",
    title: "Bengaluru HSR Tech Campus",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    category: "Corporate Campus"
  },
  {
    id: "preset-cloud",
    title: "Futuristic Cloud & AI Data Center",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    category: "Infrastructure"
  },
  {
    id: "preset-workspace",
    title: "High-Agency Open Engineering Floor",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    category: "Office Hub"
  },
  {
    id: "preset-gradient",
    title: "Minimalist Editorial Gradient",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop",
    category: "Modern Minimal"
  },
  {
    id: "preset-studio",
    title: "Creative Tech Loft & Studio",
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop",
    category: "Studio"
  }
];

export const INITIAL_COMPANY = {
  id: "comp-bharat-101",
  name: "BharatScale Cloud",
  tagline: "Next-Gen Cloud Infrastructure & High-Scale AI Runtime for India & Global Enterprises",
  domain: "bharatscale.in",
  employeeCount: "450+ Builders",
  headquarters: "Bengaluru (HSR Layout) & Mumbai (BKC)",
  logoInitials: "BS",
  logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='22' fill='%234f46e5'/><path d='M30 68V48C30 38.0589 38.0589 30 48 30H52C61.9411 30 70 38.0589 70 48V68' stroke='white' stroke-width='7' stroke-linecap='round'/><path d='M30 52H70' stroke='white' stroke-width='7' stroke-linecap='round'/><circle cx='50' cy='30' r='6' fill='%2338bdf8'/><circle cx='70' cy='68' r='5' fill='%23a855f7'/><circle cx='30' cy='68' r='5' fill='%2338bdf8'/></svg>",
  logoBadgeColor: "linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)",
  coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  brandColor: "#4f46e5",
  accentColor: "#0284c7",
  plan: "Enterprise Scale Tier",
  status: "Active",
  primaryAdmin: "vikram@bharatscale.in",
  adminPassword: "BharatScale@2026!",
  createdAt: "2025-01-15"
};

export const INITIAL_COMPANIES = [
  INITIAL_COMPANY,
  {
    id: "comp-zepto-102",
    name: "ZeptoLabs India",
    tagline: "10-Minute Dark Store Logistics & Ultra-Fast Commerce Network",
    domain: "zeptolabs.in",
    employeeCount: "1,200+ Engineers & Ops",
    headquarters: "Bengaluru (Koramangala)",
    logoInitials: "ZL",
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='22' fill='%23ea580c'/><path d='M58 18L26 54H48L40 82L74 46H52L58 18Z' fill='white' stroke='%23fef08a' stroke-width='2' stroke-linejoin='round'/></svg>",
    logoBadgeColor: "linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    brandColor: "#ea580c",
    accentColor: "#f59e0b",
    plan: "Hypergrowth Tier",
    status: "Active",
    primaryAdmin: "hr@zeptolabs.in",
    adminPassword: "ZeptoLabs#2026!",
    createdAt: "2025-03-20"
  },
  {
    id: "comp-razor-103",
    name: "Razorpay Infra",
    tagline: "Autonomous Payment Rail & Neobanking Developer Cloud",
    domain: "razorinfra.com",
    employeeCount: "800+ Fintech Builders",
    headquarters: "Bengaluru (Indiranagar)",
    logoInitials: "RI",
    logoUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'><rect width='100' height='100' rx='22' fill='%230284c7'/><path d='M28 28H72L56 50H70L38 78L46 54H32L28 28Z' fill='white'/><circle cx='70' cy='28' r='5' fill='%2338bdf8'/></svg>",
    logoBadgeColor: "linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    brandColor: "#0284c7",
    accentColor: "#06b6d4",
    plan: "Enterprise Scale Tier",
    status: "Active",
    primaryAdmin: "talent@razorinfra.com",
    adminPassword: "Razorpay$Infra26!",
    createdAt: "2025-06-10"
  }
];

export const INITIAL_COMPANY_USERS = [
  {
    id: "usr-101",
    companyId: "comp-bharat-101",
    name: "Vikram Singhania",
    email: "vikram@bharatscale.in",
    role: "Company Admin",
    title: "VP Engineering",
    department: "Engineering Leadership",
    status: "Active",
    lastLogin: "2026-09-17 05:30 IST",
    phone: "+91 98201 88492"
  },
  {
    id: "usr-102",
    companyId: "comp-bharat-101",
    name: "Sarah Jenkins",
    email: "sarah.j@bharatscale.in",
    role: "Lead Tech Recruiter",
    title: "Senior Talent Partner",
    department: "Talent Acquisition",
    status: "Active",
    lastLogin: "2026-09-17 04:15 IST",
    phone: "+91 98334 11200"
  },
  {
    id: "usr-103",
    companyId: "comp-bharat-101",
    name: "Rahul Kapoor",
    email: "rahul.k@bharatscale.in",
    role: "Hiring Manager",
    title: "Lead Architect",
    department: "Core Infrastructure",
    status: "Active",
    lastLogin: "2026-09-16 18:40 IST",
    phone: "+91 98110 54321"
  },
  {
    id: "usr-104",
    companyId: "comp-bharat-101",
    name: "Ananya Roy",
    email: "ananya.r@bharatscale.in",
    role: "Technical Interviewer",
    title: "Staff Full Stack Engineer",
    department: "Frontend & Micro-frontends",
    status: "Active",
    lastLogin: "2026-09-16 11:20 IST",
    phone: "+91 98765 43210"
  },
  {
    id: "usr-105",
    companyId: "comp-bharat-101",
    name: "Pooja Verma",
    email: "pooja.v@bharatscale.in",
    role: "HR Coordinator",
    title: "Talent Operations Specialist",
    department: "People Operations",
    status: "Invited",
    lastLogin: "Pending Invite Acceptance",
    phone: "+91 98450 12345"
  },
  {
    id: "usr-201",
    companyId: "comp-zepto-102",
    name: "Aadit Palicha",
    email: "aadit@zeptolabs.in",
    role: "Company Admin",
    title: "Co-Founder / CEO",
    department: "Executive Office",
    status: "Active",
    lastLogin: "2026-09-15 19:20 IST",
    phone: "+91 98000 00001"
  },
  {
    id: "usr-202",
    companyId: "comp-zepto-102",
    name: "Meera Nair",
    email: "meera.n@zeptolabs.in",
    role: "Lead Tech Recruiter",
    title: "Head of Tech Talent",
    department: "Supply Chain & Ops Tech",
    status: "Active",
    lastLogin: "2026-09-16 14:10 IST",
    phone: "+91 98000 00002"
  },
  {
    id: "usr-301",
    companyId: "comp-razor-103",
    name: "Shashank Kumar",
    email: "shashank@razorinfra.com",
    role: "Company Admin",
    title: "Co-Founder / CTO",
    department: "Fintech Core",
    status: "Active",
    lastLogin: "2026-09-14 10:45 IST",
    phone: "+91 99000 00001"
  },
  {
    id: "usr-302",
    companyId: "comp-razor-103",
    name: "Kunal Mathur",
    email: "kunal.m@razorinfra.com",
    role: "Hiring Manager",
    title: "Principal Engineer",
    department: "Banking Integrations",
    status: "Active",
    lastLogin: "2026-09-16 17:30 IST",
    phone: "+91 99000 00002"
  }
];

export const INITIAL_JOBS = [
  // BharatScale Cloud Jobs (comp-bharat-101)
  {
    id: "job-1",
    companyId: "comp-bharat-101",
    title: "Lead Distributed Systems Engineer",
    department: "Backend Engineering",
    location: "Bengaluru (HSR Layout)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead (6-9 yrs)",
    salary: "₹38 - ₹55 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-08",
    viewsCount: 2350,
    applicationsCount: 48,
    syndicateToAgencies: true,
    agencyBounty: "₹75,000 Cash Bounty",
    agencyCommissionPercent: "8.33% (1 Month CTC)",
    noticePeriodPreference: "Immediate or 30 Days Max",
    description: `We are seeking a seasoned Lead Distributed Systems Engineer to spearhead our high-throughput transactional backends processing over 500M daily events. You will engineer ultra low-latency distributed caches, consensus protocols, and resilient microservices in Go and Java.`,
    skills: ["Go", "Kafka", "Distributed Caching", "PostgreSQL", "Kubernetes"],
    requirements: [
      "6+ years building massive-scale distributed platforms in Go, Java, or Rust",
      "Deep hands-on expertise with Kafka, PostgreSQL, Redis Cluster, and Kubernetes",
      "Prior experience in top tier Indian product scaleups (e.g. Razorpay, Swiggy, PhonePe, Flipkart)",
      "Strong command over concurrency, memory profiling, and zero-downtime database migrations"
    ],
    benefits: [
      "Competitive fixed salary + attractive ESOPs with annual buyback liquidity",
      "Comprehensive ₹10 Lakhs Family Health Cover including Dependent Parents",
      "₹60,000 Annual Ergonomic Home Office & Upskilling Allowance"
    ],
    screeningQuestions: [
      "What is your Current CTC and Expected CTC in LPA?",
      "What is your official Notice Period, and is Notice Buyout possible?",
      "Describe a distributed systems concurrency or database bottleneck you solved at scale."
    ]
  },
  {
    id: "job-2",
    companyId: "comp-bharat-101",
    title: "Staff AI/LLM Systems Architect",
    department: "AI & Data",
    location: "Bengaluru / Pan-India Remote",
    workType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Staff (7+ yrs)",
    salary: "₹50 - ₹75 LPA + 0.2% Equity",
    status: "active",
    postedDate: "2026-09-04",
    viewsCount: 1820,
    applicationsCount: 24,
    syndicateToAgencies: true,
    agencyBounty: "₹1,25,000 Cash Bounty",
    agencyCommissionPercent: "10% CTC",
    noticePeriodPreference: "Serving Notice Period preferred",
    description: `Architect custom high-throughput LLM inference engines, fine-tuning runtimes, and agentic workflows tailored for multilingual Indic and enterprise workloads.`,
    skills: ["PyTorch", "vLLM", "CUDA Kernels", "Python", "GPU Clusters"],
    requirements: [
      "7+ years in distributed ML systems with hands-on vLLM, TensorRT-LLM, or Triton deployment",
      "Deep mastery of PyTorch, CUDA kernel optimizations, and GPU cluster scheduling",
      "Track record of published research or notable open-source AI frameworks"
    ],
    benefits: [
      "Tier-1 executive compensation & substantial ESOP grants",
      "Latest Apple M4 Max developer gear and unlimited GPU sandbox compute"
    ],
    screeningQuestions: [
      "Current vs Expected CTC & Current Notice Period?",
      "Have you optimized tensor parallelism, KV caching, or quantization in production?"
    ]
  },
  {
    id: "job-3",
    companyId: "comp-bharat-101",
    title: "Senior Full Stack Engineer (React / TypeScript)",
    department: "Frontend Platform",
    location: "Gurugram (Cyber City)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior (4-7 yrs)",
    salary: "₹26 - ₹38 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-10",
    viewsCount: 1940,
    applicationsCount: 62,
    syndicateToAgencies: true,
    agencyBounty: "₹50,000 Cash Bounty",
    agencyCommissionPercent: "8.33% (1 Month CTC)",
    noticePeriodPreference: "Immediate or 15 Days",
    description: `Craft lightning-fast, pixel-perfect developer consoles and interactive analytics interfaces. Champion high web vitals, accessible components, and modular frontend architectures.`,
    skills: ["React", "TypeScript", "Next.js", "WebSockets", "CSS Architecture"],
    requirements: [
      "4+ years building high-traffic web applications with React, TypeScript, and modern CSS",
      "Deep understanding of browser rendering performance, state management, and WebSockets",
      "Strong product intuition and dedication to delightful UI craft"
    ],
    benefits: [
      "Generous health & wellness coverage for spouse, kids, and parents",
      "Flexible hybrid hours with catered office lunch and snacks"
    ],
    screeningQuestions: [
      "What is your Current and Expected CTC?",
      "What is your official Notice Period?",
      "Share your GitHub or live links to projects you've built."
    ]
  },
  {
    id: "job-4",
    companyId: "comp-bharat-101",
    title: "Lead Product Designer (Design Systems)",
    department: "Product Design",
    location: "Mumbai (BKC)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead (5-8 yrs)",
    salary: "₹25 - ₹36 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-02",
    viewsCount: 1200,
    applicationsCount: 35,
    syndicateToAgencies: false,
    agencyBounty: "₹40,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "30 Days Max",
    description: `Build and govern our unified enterprise design system. Design intuitive workflows for DevOps engineers, cloud architects, and enterprise buyers.`,
    skills: ["Figma Tokens", "Design Systems", "Product Strategy", "Interaction Design"],
    requirements: [
      "5+ years designing enterprise SaaS, fintech, or developer platform UIs",
      "Mastery of Figma tokens, auto-layout, micro-animations, and design system governance"
    ],
    benefits: [
      "Ergonomic workstation setup allowance",
      "Flexible remote working options and generous wellness leave"
    ],
    screeningQuestions: [
      "Please share your portfolio / Figma showcase link.",
      "What is your notice period and current compensation?"
    ]
  },
  {
    id: "job-5",
    companyId: "comp-bharat-101",
    title: "Staff DevOps & SRE Engineer",
    department: "Cloud Infrastructure",
    location: "Hyderabad (HITEC City)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Staff (6+ yrs)",
    salary: "₹32 - ₹46 LPA + ESOPs",
    status: "active",
    postedDate: "2026-08-25",
    viewsCount: 950,
    applicationsCount: 28,
    syndicateToAgencies: false,
    agencyBounty: "₹60,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Immediate Joiner",
    description: `Maintain 99.99% uptime across our AWS and GCP multi-region Kubernetes clusters. Automate observability, disaster recovery, and infrastructure as code with Terraform.`,
    skills: ["Kubernetes", "Terraform", "AWS", "Prometheus", "Golang"],
    requirements: [
      "6+ years managing multi-cluster production Kubernetes and cloud networks",
      "Expertise in Terraform, Helm, Prometheus, Grafana, and CI/CD pipelines"
    ],
    benefits: [
      "Generous on-call allowances and premium health insurance",
      "Annual cloud certification vouchers"
    ],
    screeningQuestions: [
      "Current CTC, Expected CTC & Notice Period?",
      "Describe an incident where you restored a degraded Kubernetes cluster in production."
    ]
  },

  // ZeptoLabs India Jobs (comp-zepto-102)
  {
    id: "job-zepto-1",
    companyId: "comp-zepto-102",
    title: "Staff Backend Engineer - 10-Min Dispatch & Routing Engine",
    department: "Logistics Engineering",
    location: "Bengaluru (Koramangala)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Staff (6-9 yrs)",
    salary: "₹42 - ₹62 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-11",
    viewsCount: 3100,
    applicationsCount: 54,
    syndicateToAgencies: true,
    agencyBounty: "₹1,00,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Immediate or 30 Days Max",
    description: `Architect real-time rider dispatch algorithms, dark-store batching, and dynamic route optimization systems that fulfill orders in under 10 minutes across 30+ Indian cities.`,
    skills: ["Go", "Distributed Graph Algorithms", "Kafka", "PostgreSQL", "Redis"],
    requirements: [
      "5+ years building ultra low-latency hyper-scale backend engines",
      "Prior experience in mobility, quick-commerce, or food delivery routing",
      "Deep understanding of concurrent event processing and real-time geospatial indexing"
    ],
    benefits: [
      "Tier-1 quick-commerce equity grant with strong liquidity track record",
      "Comprehensive medical floater for family and dependent parents",
      "Latest M3 Max Apple Silicon laptop"
    ],
    screeningQuestions: [
      "What is your Current and Expected CTC in LPA?",
      "What is your official Notice Period?",
      "Have you worked on geospatial indexing (H3, S2) or real-time dispatch systems?"
    ]
  },
  {
    id: "job-zepto-2",
    companyId: "comp-zepto-102",
    title: "Lead Mobile Architect (Android / Kotlin) - Dark Store Ops",
    department: "Mobile Platform",
    location: "Bengaluru (Koramangala)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead (6+ yrs)",
    salary: "₹36 - ₹50 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-09",
    viewsCount: 2240,
    applicationsCount: 39,
    syndicateToAgencies: true,
    agencyBounty: "₹75,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "30 Days Max",
    description: `Lead architecture for the high-efficiency picking and dark store warehousing Android applications used by tens of thousands of staff to pick 40+ item baskets in under 90 seconds.`,
    skills: ["Android", "Kotlin", "Jetpack Compose", "Coroutines", "Bluetooth / Hardware Scanning"],
    requirements: [
      "6+ years developing high-reliability Android applications in Kotlin",
      "Experience optimizing app start times, offline-first sync, and barcode scanner SDKs",
      "Demonstrated ability to architect modular mobile codebases"
    ],
    benefits: [
      "Generous health & accidental insurance",
      "Annual team offsites & wellness budget"
    ],
    screeningQuestions: [
      "Current vs Expected CTC?",
      "Share your GitHub or Play Store apps you've built."
    ]
  },
  {
    id: "job-zepto-3",
    companyId: "comp-zepto-102",
    title: "Senior Data Scientist - Micro-Fulfillment Demand Forecasting",
    department: "Data & AI",
    location: "Bengaluru (Koramangala)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior (4-7 yrs)",
    salary: "₹34 - ₹48 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-06",
    viewsCount: 1680,
    applicationsCount: 31,
    syndicateToAgencies: false,
    agencyBounty: "₹50,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Serving Notice preferred",
    description: `Build hyperlocal demand forecasting ML models predicting stock-outs and perishables demand for hundreds of dark stores across India with 98%+ accuracy.`,
    skills: ["Python", "Time Series ML", "LightGBM", "PyTorch", "Snowflake", "Airflow"],
    requirements: [
      "4+ years deploying production forecasting or supply chain optimization models",
      "Strong mathematics, statistics, and causal inference background",
      "Familiarity with distributed data processing in PySpark and SQL"
    ],
    benefits: [
      "Generous performance bonuses and stock options",
      "Free Zepto Pass and daily gourmet snacks"
    ],
    screeningQuestions: [
      "What is your Current and Expected CTC in LPA?",
      "Briefly describe your experience with high-frequency time-series forecasting."
    ]
  },
  {
    id: "job-zepto-4",
    companyId: "comp-zepto-102",
    title: "Staff SRE & Infrastructure - Flash Sales & Peak Load",
    department: "Infrastructure",
    location: "Bengaluru (Koramangala)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Staff (6+ yrs)",
    salary: "₹40 - ₹58 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-01",
    viewsCount: 1980,
    applicationsCount: 42,
    syndicateToAgencies: true,
    agencyBounty: "₹80,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Immediate Joiner",
    description: `Ensure flawless 99.999% uptime during high-volume IPL matches, festive seasons, and sudden flash order spikes processing 30,000+ RPS.`,
    skills: ["Kubernetes", "AWS EKS", "Terraform", "Distributed Tracing", "Chaos Engineering"],
    requirements: [
      "6+ years managing large-scale Kubernetes clusters under sudden 10x traffic bursts",
      "Mastery of multi-AZ failovers, Kafka cluster reliability, and database connection pooling"
    ],
    benefits: [
      "On-call compensation + lucrative ESOP wealth grants",
      "Full family health cover with zero copay"
    ],
    screeningQuestions: [
      "Notice Period and compensation expectations?",
      "How do you autoscale Kubernetes pods ahead of predictable flash traffic surges?"
    ]
  },

  // Razorpay Infra Jobs (comp-razor-103)
  {
    id: "job-razor-1",
    companyId: "comp-razor-103",
    title: "Principal Payment Platform Architect",
    department: "Core Payments",
    location: "Bengaluru (Indiranagar)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Principal (8+ yrs)",
    salary: "₹58 - ₹85 LPA + Tier-1 ESOPs",
    status: "active",
    postedDate: "2026-09-07",
    viewsCount: 2890,
    applicationsCount: 44,
    syndicateToAgencies: true,
    agencyBounty: "₹1,50,000 Cash Bounty",
    agencyCommissionPercent: "10%",
    noticePeriodPreference: "30 Days Max",
    description: `Architect the mission-critical core payment rails handling UPI, cards, netbanking, and neobanking APIs processing billions of dollars in gross transaction value monthly.`,
    skills: ["Distributed Transactions", "Go", "PostgreSQL", "Kafka", "Zero-Downtime Architecture"],
    requirements: [
      "8+ years architecting zero-failure financial platforms or payment gateways",
      "Deep understanding of idempotent transaction processing, two-phase commit, and reconciliation",
      "Expertise in designing compliant, multi-region resilient payment switches"
    ],
    benefits: [
      "Top-tier compensation with liquid secondary ESOP buyback programs",
      "₹10L comprehensive health coverage including parents"
    ],
    screeningQuestions: [
      "What is your Current and Expected CTC in LPA?",
      "Describe an idempotency or reconciliation challenge you architected for fintech."
    ]
  },
  {
    id: "job-razor-2",
    companyId: "comp-razor-103",
    title: "Lead Security & Cryptography Engineer (PCI-DSS & Tokenization)",
    department: "Security Engineering",
    location: "Bengaluru (Indiranagar)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead (5-8 yrs)",
    salary: "₹36 - ₹52 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-05",
    viewsCount: 1720,
    applicationsCount: 26,
    syndicateToAgencies: true,
    agencyBounty: "₹85,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Immediate or 30 Days",
    description: `Lead vault architecture, hardware security modules (HSMs), tokenization engines, and cryptographic key management protecting millions of cardholders across India.`,
    skills: ["HSM", "PCI-DSS", "AES-256 GCM", "Zero Trust", "Go / Rust", "Cloud Security"],
    requirements: [
      "5+ years in security engineering with deep expertise in cryptographic tokenization and PCI-DSS Level 1 compliance",
      "Hands-on experience with AWS KMS, CloudHSM, Vault, and secure enclaves"
    ],
    benefits: [
      "Tier-1 fintech compensation package",
      "Continuous cybersecurity upskilling & conference budget"
    ],
    screeningQuestions: [
      "Current CTC, Expected CTC & Notice Period?",
      "What is your experience with PCI-DSS tokenization architectures?"
    ]
  },
  {
    id: "job-razor-3",
    companyId: "comp-razor-103",
    title: "Staff SRE - Banking Switch & Zero-Downtime Settlement",
    department: "Banking Platform",
    location: "Bengaluru / Mumbai",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Staff (6+ yrs)",
    salary: "₹40 - ₹58 LPA + ESOPs",
    status: "active",
    postedDate: "2026-09-03",
    viewsCount: 2010,
    applicationsCount: 38,
    syndicateToAgencies: true,
    agencyBounty: "₹90,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "Immediate Joiner",
    description: `Maintain 99.999% availability for core banking integrations, IMPS/NEFT/RTGS rails, and automated merchant settlement pipelines.`,
    skills: ["Kubernetes", "PostgreSQL Replication", "Terraform", "Kafka", "Observability"],
    requirements: [
      "6+ years managing financial services infrastructure with strict RPO/RTO mandates",
      "Hands-on database failover, multi-region active-active architectures, and automated disaster recovery"
    ],
    benefits: [
      "Competitive base pay, guaranteed annual ESOP buyback, and comprehensive family floater"
    ],
    screeningQuestions: [
      "What is your notice period and current compensation?",
      "How have you handled automated failover for high-volume relational databases?"
    ]
  },
  {
    id: "job-razor-4",
    companyId: "comp-razor-103",
    title: "Lead Frontend Engineer - Merchant Checkout SDK & API Platform",
    department: "Developer Experience",
    location: "Bengaluru (Indiranagar)",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead (5-8 yrs)",
    salary: "₹30 - ₹44 LPA + ESOPs",
    status: "active",
    postedDate: "2026-08-29",
    viewsCount: 2150,
    applicationsCount: 47,
    syndicateToAgencies: false,
    agencyBounty: "₹60,000 Cash Bounty",
    agencyCommissionPercent: "8.33%",
    noticePeriodPreference: "30 Days Max",
    description: `Craft the ultra-lightweight, zero-latency checkout SDK rendered on millions of e-commerce checkouts across India with sub-second initialization times.`,
    skills: ["TypeScript", "Vanilla JS / Micro-bundle", "React", "Cross-Origin Security", "Web Performance"],
    requirements: [
      "5+ years crafting high-performance SDKs and web applications in TypeScript",
      "Deep understanding of iframe security, postMessage protocols, and bundle size minimization"
    ],
    benefits: [
      "Annual Goa engineering offsites and generous wellness perks",
      "Home office setup reimbursement"
    ],
    screeningQuestions: [
      "What is your current notice period and CTC?",
      "Share your experience with bundle-size optimization for third-party script SDKs."
    ]
  }
];

export const INITIAL_AGENCIES = [
  {
    id: "agy-1",
    name: "Naukri Elite Talent Partners",
    portalCode: "NAUKRI-ELITE-BLR",
    primaryContact: "Vikas Malhotra",
    email: "vikas.malhotra@naukrielite.in",
    portalPassword: "Naukri@Elite2026!",
    phone: "+91 98201 55432",
    city: "Bengaluru",
    activeJobsAssigned: 3,
    candidatesSubmitted: 16,
    placementsHired: 3,
    totalBountiesEarned: "₹2,25,000",
    status: "active",
    tier: "Elite Partner",
    rating: 4.9,
    joinedDate: "2026-02-15"
  },
  {
    id: "agy-2",
    name: "ABC Consultants Tech Practice",
    portalCode: "ABC-INDIA-MUM",
    primaryContact: "Ritu Sengupta",
    email: "ritu.sengupta@abcconsultants.in",
    portalPassword: "ABC@Consult2026!",
    phone: "+91 98450 77123",
    city: "Mumbai & Gurugram",
    activeJobsAssigned: 3,
    candidatesSubmitted: 11,
    placementsHired: 2,
    totalBountiesEarned: "₹1,50,000",
    status: "active",
    tier: "Certified Headhunter",
    rating: 4.8,
    joinedDate: "2026-04-10"
  },
  {
    id: "agy-3",
    name: "SutraHR Executive Search",
    portalCode: "SUTRA-TECH-PUN",
    primaryContact: "Waqar Sheikh",
    email: "waqar@sutrahr.in",
    portalPassword: "Sutra#HR2026!",
    phone: "+91 97112 88401",
    city: "Pune & Bengaluru",
    activeJobsAssigned: 2,
    candidatesSubmitted: 6,
    placementsHired: 1,
    totalBountiesEarned: "₹75,000",
    status: "active",
    tier: "Elite Partner",
    rating: 5.0,
    joinedDate: "2026-06-20"
  }
];

export const INITIAL_CANDIDATES = [
  {
    id: "cand-1",
    name: "Rohan Deshmukh",
    email: "rohan.deshmukh@gmail.com",
    phone: "+91 98201 88492",
    location: "Bengaluru, Karnataka",
    jobId: "job-1",
    role: "Lead Distributed Systems Engineer",
    stage: "interview",
    source: "Naukri Elite Talent Partners",
    sourceType: "agency",
    submittedAt: "2026-09-12",
    matchScore: 97,
    rating: 5,
    experience: "7 years",
    currentCompany: "Razorpay (Payments Core)",
    currentCtc: "₹34 LPA",
    expectedCtc: "₹46 LPA",
    noticePeriod: "15 Days (Serving Notice)",
    noticeType: "serving",
    education: "IIT Bombay (B.Tech CSE)",
    tags: ["IIT Bombay", "Ex-Razorpay", "Serving Notice", "Go/Kafka Expert"],
    notes: [
      { author: "Vikas Malhotra (Naukri Elite)", text: "Rohan is currently serving notice at Razorpay with Last Working Day on Oct 5th. Strong hands-on distributed systems expertise.", date: "2026-09-12" },
      { author: "Vikram Singhania (VP Eng)", text: "Cleared Machine Coding Round with top marks. System architecture interview scheduled.", date: "2026-09-14" }
    ],
    scorecard: {
      technicalSkills: 5,
      systemDesign: 5,
      cultureAlignment: 5,
      communication: 4,
      recommendation: "Strong Hire"
    },
    interviewScheduled: {
      date: "2026-09-18",
      time: "03:00 PM IST",
      round: "System Architecture & Low Latency Design",
      interviewer: "Vikram Singhania (VP Engineering)",
      meetingLink: "https://meet.google.com/bs-arch-sync"
    },
    screeningAnswers: [
      { question: "Current and Expected CTC?", answer: "Current: ₹34 LPA Fixed. Expected: ₹46 LPA." },
      { question: "Notice Period details?", answer: "Serving notice period, 15 days remaining. LWD is Oct 5th, 2026." },
      { question: "Distributed bottleneck solved?", answer: "Redesigned Redis cluster caching and async batch settlement, cutting p99 payment processing latency from 450ms to 85ms." }
    ]
  },
  {
    id: "cand-2",
    name: "Priyadarshini Nair",
    email: "priya.nair@research.in",
    phone: "+91 98450 33419",
    location: "Bengaluru, Karnataka",
    jobId: "job-2",
    role: "Staff AI/LLM Systems Architect",
    stage: "offer",
    source: "ABC Consultants Tech Practice",
    sourceType: "agency",
    submittedAt: "2026-09-09",
    matchScore: 98,
    rating: 5,
    experience: "8 years",
    currentCompany: "PhonePe / Microsoft Research",
    currentCtc: "₹45 LPA",
    expectedCtc: "₹62 LPA + ESOPs",
    noticePeriod: "30 Days (Notice Buyout Available)",
    noticeType: "standard",
    education: "IISc Bengaluru (M.Tech AI)",
    tags: ["IISc Alum", "Ex-PhonePe", "CUDA Specialist", "Offer Out"],
    notes: [
      { author: "Ritu Sengupta (ABC Consultants)", text: "Priyadarshini is a premier AI systems specialist with multiple patents in distributed LLM caching.", date: "2026-09-09" },
      { author: "Aakash Mehta (CTO)", text: "Outstanding deep-dive in Triton kernels. Written offer letter generated for ₹60 LPA + ₹15 Lakhs ESOP grant.", date: "2026-09-15" }
    ],
    scorecard: {
      technicalSkills: 5,
      systemDesign: 5,
      cultureAlignment: 5,
      communication: 5,
      recommendation: "Immediate Offer Extended"
    },
    interviewScheduled: null,
    screeningAnswers: [
      { question: "CTC & Notice Period?", answer: "Current: ₹45 LPA. Expected: ₹62 LPA. 30 days notice with buyout option." }
    ]
  },
  {
    id: "cand-3",
    name: "Aarav Sharma",
    email: "aarav.sharma@frontend.dev",
    phone: "+91 97112 04812",
    location: "Gurugram, Haryana",
    jobId: "job-3",
    role: "Senior Full Stack Engineer (React / TypeScript)",
    stage: "applied",
    source: "Career Page",
    sourceType: "direct",
    submittedAt: "2026-09-16",
    matchScore: 92,
    rating: 4,
    experience: "5.5 years",
    currentCompany: "Zomato",
    currentCtc: "₹24 LPA",
    expectedCtc: "₹34 LPA",
    noticePeriod: "Immediate Joiner (Already relieved)",
    noticeType: "immediate",
    education: "BITS Pilani",
    tags: ["Immediate Joiner", "BITS Pilani", "Ex-Zomato", "React Guru"],
    notes: [
      { author: "Recruitment Team", text: "Direct website applicant. Already relieved from Zomato and can join within 48 hours! Priority candidate.", date: "2026-09-16" }
    ],
    scorecard: {
      technicalSkills: 4,
      systemDesign: 5,
      cultureAlignment: 4,
      communication: 5,
      recommendation: "Fast-Track Candidate"
    },
    interviewScheduled: null,
    screeningAnswers: [
      { question: "CTC & Notice Period?", answer: "Current: ₹24 LPA. Expected: ₹34 LPA. Immediate joiner (relieved this week)." }
    ]
  },
  {
    id: "cand-4",
    name: "Ananya Iyer",
    email: "ananya.iyer@designcraft.co",
    phone: "+91 98200 44901",
    location: "Mumbai, Maharashtra",
    jobId: "job-4",
    role: "Lead Product Designer (Design Systems)",
    stage: "assessment",
    source: "Career Page",
    sourceType: "direct",
    submittedAt: "2026-09-14",
    matchScore: 90,
    rating: 4,
    experience: "6 years",
    currentCompany: "CRED",
    currentCtc: "₹22 LPA",
    expectedCtc: "₹30 LPA",
    noticePeriod: "30 Days",
    noticeType: "standard",
    education: "NID Ahmedabad",
    tags: ["NID Alum", "Ex-CRED", "Design Tokens", "Portfolio Star"],
    notes: [
      { author: "Hiring Lead", text: "Stunning portfolio with micro-interactions and coded tokens. Sent design challenge assignment.", date: "2026-09-14" }
    ],
    scorecard: {
      technicalSkills: 5,
      systemDesign: 4,
      cultureAlignment: 5,
      communication: 5,
      recommendation: "Advance to Design Review"
    },
    interviewScheduled: null,
    screeningAnswers: [
      { question: "Portfolio & CTC?", answer: "Portfolio: ananyaiyer.design | Current: ₹22 LPA, Expected: ₹30 LPA. Notice: 30 days." }
    ]
  },
  {
    id: "cand-5",
    name: "Vikramaditya Rao",
    email: "vikram.rao@hyderabad-tech.net",
    phone: "+91 99490 12894",
    location: "Hyderabad, Telangana",
    jobId: "job-1",
    role: "Lead Distributed Systems Engineer",
    stage: "screening",
    source: "Employee Referral",
    sourceType: "referral",
    submittedAt: "2026-09-15",
    matchScore: 89,
    rating: 4,
    experience: "6 years",
    currentCompany: "Swiggy",
    currentCtc: "₹31 LPA",
    expectedCtc: "₹42 LPA",
    noticePeriod: "Immediate Joiner (Serving last 5 days)",
    noticeType: "immediate",
    education: "NIT Warangal",
    tags: ["NIT Warangal", "Ex-Swiggy", "Immediate Joiner", "Referral"],
    notes: [
      { author: "Aditya (Senior Architect)", text: "Referred Vikram from my previous team at Swiggy. Great hands-on problem solver.", date: "2026-09-15" }
    ],
    scorecard: {
      technicalSkills: 4,
      systemDesign: 4,
      cultureAlignment: 5,
      communication: 4,
      recommendation: "Schedule Technical Round"
    },
    interviewScheduled: null,
    screeningAnswers: [
      { question: "CTC & Notice Period?", answer: "Current: ₹31 LPA. Expected: ₹42 LPA. Serving last 5 days of notice." }
    ]
  },
  {
    id: "cand-6",
    name: "Sneha Kulkarni",
    email: "sneha.k@pune-systems.org",
    phone: "+91 98601 22345",
    location: "Pune, Maharashtra",
    jobId: "job-3",
    role: "Senior Full Stack Engineer (React / TypeScript)",
    stage: "interview",
    source: "SutraHR Executive Search",
    sourceType: "agency",
    submittedAt: "2026-09-11",
    matchScore: 94,
    rating: 5,
    experience: "5 years",
    currentCompany: "Postman",
    currentCtc: "₹25 LPA",
    expectedCtc: "₹35 LPA",
    noticePeriod: "15 Days Notice",
    noticeType: "serving",
    education: "COEP Pune",
    tags: ["COEP Pune", "Ex-Postman", "API Specialist", "Agency Candidate"],
    notes: [
      { author: "Waqar Sheikh (SutraHR)", text: "Sneha contributed directly to Postman's desktop client modules. Looking for next scale-up journey.", date: "2026-09-11" }
    ],
    scorecard: {
      technicalSkills: 5,
      systemDesign: 4,
      cultureAlignment: 5,
      communication: 5,
      recommendation: "Strong Candidate"
    },
    interviewScheduled: {
      date: "2026-09-20",
      time: "11:30 AM IST",
      round: "Frontend System Architecture & Live Coding",
      interviewer: "Rahul Kapoor (Lead Architect)",
      meetingLink: "https://meet.google.com/bs-fe-deepdive"
    },
    screeningAnswers: [
      { question: "CTC & Notice Period?", answer: "Current: ₹25 LPA. Expected: ₹35 LPA. Notice: 15 days." }
    ]
  },
  {
    id: "cand-7",
    name: "Aditya Verma",
    email: "aditya.verma@cloudscale.in",
    phone: "+91 98100 88721",
    location: "Noida / Delhi NCR",
    jobId: "job-1",
    role: "Lead Distributed Systems Engineer",
    stage: "hired",
    source: "Naukri Elite Talent Partners",
    sourceType: "agency",
    submittedAt: "2026-08-18",
    matchScore: 96,
    rating: 5,
    experience: "7.5 years",
    currentCompany: "BharatScale Cloud (Offer Accepted)",
    currentCtc: "₹35 LPA",
    expectedCtc: "₹48 LPA",
    noticePeriod: "Joined",
    noticeType: "hired",
    education: "IIT Delhi",
    tags: ["IIT Delhi", "Offer Accepted", "Joining Oct 1st", "Agency Placement"],
    notes: [
      { author: "Vikas Malhotra (Naukri Elite)", text: "Offer letter signed. Relocation to Bengaluru confirmed for Oct 1st. Agency bounty ₹75,000 processed.", date: "2026-09-01" }
    ],
    scorecard: {
      technicalSkills: 5,
      systemDesign: 5,
      cultureAlignment: 5,
      communication: 5,
      recommendation: "Hired"
    },
    interviewScheduled: null,
    screeningAnswers: []
  },
  {
    id: "cand-8",
    name: "Tanvi Banerjee",
    email: "tanvi.banerjee@techkolkata.in",
    phone: "+91 98301 66520",
    location: "Kolkata / Remote",
    jobId: "job-3",
    role: "Senior Full Stack Engineer (React / TypeScript)",
    stage: "screening",
    source: "Career Page",
    sourceType: "direct",
    submittedAt: "2026-09-15",
    matchScore: 86,
    rating: 4,
    experience: "4 years",
    currentCompany: "Flipkart",
    currentCtc: "₹20 LPA",
    expectedCtc: "₹29 LPA",
    noticePeriod: "30 Days",
    noticeType: "standard",
    education: "Jadavpur University",
    tags: ["Jadavpur Univ", "Ex-Flipkart", "Fast Learner"],
    notes: [
      { author: "Talent Acquisition Lead", text: "Strong fundamentals. Scheduled 30-min recruiter sync.", date: "2026-09-15" }
    ],
    scorecard: {
      technicalSkills: 4,
      systemDesign: 4,
      cultureAlignment: 4,
      communication: 4,
      recommendation: "Screening Scheduled"
    },
    interviewScheduled: null,
    screeningAnswers: []
  }
];

export const INITIAL_INTERVIEWS = [
  {
    id: "int-101",
    candidateId: "cand-1",
    candidateName: "Rohan Deshmukh",
    role: "Lead Distributed Systems Engineer",
    date: "2026-09-18",
    time: "03:00 PM IST",
    round: "System Architecture & Low Latency Design",
    interviewer: "Vikram Singhania (VP Engineering)",
    status: "Confirmed",
    meetingLink: "https://meet.google.com/bs-arch-sync",
    source: "Naukri Elite Talent Partners"
  },
  {
    id: "int-102",
    candidateId: "cand-6",
    candidateName: "Sneha Kulkarni",
    role: "Senior Full Stack Engineer",
    date: "2026-09-20",
    time: "11:30 AM IST",
    round: "Frontend System Architecture & Live Coding",
    interviewer: "Rahul Kapoor (Lead Architect)",
    status: "Confirmed",
    meetingLink: "https://meet.google.com/bs-fe-deepdive",
    source: "SutraHR Executive Search"
  }
];

export const INITIAL_CAREER_SETTINGS = {
  companyName: "BharatScale Cloud",
  tagline: "India's Premier High-Performance Autonomous Cloud Infrastructure Platform",
  brandColor: "#4f46e5",
  accentColor: "#0284c7",
  heroHeadline: "Build the Cloud & AI Primitives Shaping Digital India",
  heroDescription: "Join high-agency builders, engineers, and researchers crafting low-latency distributed systems powering next-generation AI and financial infrastructure.",
  cultureQuote: "We foster radical ownership, transparent salaries, deep technical craft, and zero bureaucratic politics.",
  perks: [
    "₹10 Lakhs Family & Dependent Parents Medical Floater",
    "Lucrative ESOPs with Annual Guaranteed Buyback Liquidity",
    "₹60,000 Annual Ergonomic Workspace & Upskilling Stipend",
    "Flexible Remote & Hybrid Hubs (Bengaluru, Mumbai, Gurugram)",
    "Annual All-Hands Goa Offsite & Recharge Long Weekends",
    "Provident Fund (PF), Gratuity & Voluntary NPS Matching"
  ],
  iframeConfig: {
    theme: "light",
    width: "100%",
    minHeight: "760px",
    showHeader: true,
    showFilters: true,
    borderStyle: "none",
    borderRadius: "12px"
  }
};
