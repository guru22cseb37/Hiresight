import { createClient as originalCreateClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we should use the mock client (either because URL is invalid/dummy or because we want an infallible system)
const shouldMock = !supabaseUrl || 
                   supabaseUrl.includes('whyegstfaolyjvfeylov') || 
                   supabaseUrl.includes('placeholder') ||
                   supabaseUrl.includes('example.co');

export type Role = 'job_seeker' | 'recruiter';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: Role;
  phone?: string;
  location?: string;
  bio?: string;
  linkedin_url?: string;
}

// Global server-safe in-memory store for environments where localStorage is not defined
const memoryStore: Record<string, string> = {};

const getStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return memoryStore[key] || null;
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  } else {
    memoryStore[key] = value;
  }
};

// Seed initial mock tables to ensure dashboards look stunning and full on first load
const seedMockData = () => {
  if (typeof window === 'undefined') return;

  // 1. Initial users list
  if (!localStorage.getItem('hiresight_mock_users_auth')) {
    const defaultAuthUsers = [
      { id: 'recruiter-id-123', email: 'recruiter@gmail.com', password: '1234567', role: 'recruiter', full_name: 'Recruiter Admin' },
      { id: 'candidate-id-123', email: 'candidate@gmail.com', password: '1234567', role: 'job_seeker', full_name: 'Candidate John' }
    ];
    localStorage.setItem('hiresight_mock_users_auth', JSON.stringify(defaultAuthUsers));
  }

  if (!localStorage.getItem('hiresight_mock_users')) {
    const defaultProfiles = [
      { id: 'recruiter-id-123', email: 'recruiter@gmail.com', role: 'recruiter', full_name: 'Recruiter Admin', location: 'San Francisco, CA', bio: 'Senior Recruiting Manager specializing in AI and Frontend Architect roles.' },
      { id: 'candidate-id-123', email: 'candidate@gmail.com', role: 'job_seeker', full_name: 'Candidate John', location: 'Seattle, WA', bio: 'Passionate Frontend Developer focused on React, TypeScript, and Framer Motion.' }
    ];
    localStorage.setItem('hiresight_mock_users', JSON.stringify(defaultProfiles));
  }

  // 2. Pre-seeded Premium Job Postings
  if (!localStorage.getItem('hiresight_mock_job_postings')) {
    const jobs = [
      {
        id: 'job-1',
        recruiter_id: 'recruiter-id-123',
        company_name: 'OpenAI',
        role: 'Senior AI Frontend Architect',
        description: 'Lead the design of next-generation cinematic UI controls for conversational reasoning models.',
        requirements: ['React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
        location: 'San Francisco, CA (Hybrid)',
        salary_min: 190000,
        salary_max: 270000,
        status: 'published',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'job-2',
        recruiter_id: 'recruiter-id-123',
        company_name: 'Vercel',
        role: 'Staff Framework Engineer',
        description: 'Drive implementation of high-performance rendering solutions and stream-based server interfaces.',
        requirements: ['React', 'Next.js', 'WebAssembly', 'Rust'],
        location: 'Remote',
        salary_min: 200000,
        salary_max: 280000,
        status: 'published',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'job-3',
        recruiter_id: 'recruiter-id-123',
        company_name: 'Stripe',
        role: 'Frontend Infrastructure Lead',
        description: 'Architect secure, performant payment checkout SDKs used by millions of digital platforms.',
        requirements: ['Vanilla JS', 'TypeScript', 'CSS', 'Performance Tuning'],
        location: 'Seattle, WA (Hybrid)',
        salary_min: 175000,
        salary_max: 240000,
        status: 'published',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('hiresight_mock_job_postings', JSON.stringify(jobs));
  }

  // 3. Pre-seeded Top Matching Candidates for Recruiter
  if (!localStorage.getItem('hiresight_mock_candidates')) {
    const candidates = [
      {
        id: 'cand-1',
        recruiter_id: 'recruiter-id-123',
        job_id: 'job-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@ai-designer.io',
        phone: '+1 (555) 382-9018',
        ai_score: 98,
        ai_summary: 'Outstanding visual designer with deep framework optimization skills and immersive motion portfolios.',
        strengths: ['Framer Motion', 'System Design', 'React', 'WebGL'],
        gaps: ['Rust Backend'],
        stage: 'new',
        notes: 'Applied for Senior AI Frontend Architect at OpenAI. Superb cultural fit.',
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cand-2',
        recruiter_id: 'recruiter-id-123',
        job_id: 'job-1',
        name: 'Marcus Miller',
        email: 'marcus.m@frontendarchitect.org',
        phone: '+1 (555) 492-3021',
        ai_score: 94,
        ai_summary: 'Strong engineering background, previously authored multiple micro-interaction open source libraries.',
        strengths: ['TypeScript', 'TailwindCSS', 'Micro-animations'],
        gaps: ['WebGL'],
        stage: 'interview',
        notes: 'Exceptional visual design execution. Schedule technical screening phase.',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'cand-3',
        recruiter_id: 'recruiter-id-123',
        job_id: 'job-2',
        name: 'Aria Tanaka',
        email: 'aria.t@cybernetic-systems.co',
        phone: '+1 (555) 203-9182',
        ai_score: 91,
        ai_summary: 'Specialist in framework architecture and performance tuning of React rendering pipelines.',
        strengths: ['Next.js', 'Rust', 'WebAssembly', 'Performance Tuning'],
        gaps: ['Vanilla CSS animations'],
        stage: 'new',
        notes: 'Strong candidate for Staff Framework Engineer. Previously at Vercel core group.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('hiresight_mock_candidates', JSON.stringify(candidates));
  }

  // 4. Pre-seeded Candidate Resumes
  if (!localStorage.getItem('hiresight_mock_resumes')) {
    const resumes = [
      {
        id: 'resume-1',
        user_id: 'candidate-id-123',
        name: 'Candidate_John_Frontend_Architect',
        raw_text: 'Experienced frontend developer with expertise in React, Next.js, and immersive user experiences.',
        file_url: '/mock-pdf.pdf',
        is_default: true,
        ats_health_score: 95,
        version: 1,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('hiresight_mock_resumes', JSON.stringify(resumes));
  }

  // 5. Pre-seeded Applications
  if (!localStorage.getItem('hiresight_mock_applications')) {
    const apps = [
      {
        id: 'app-1',
        user_id: 'candidate-id-123',
        resume_id: 'resume-1',
        company_name: 'OpenAI',
        role: 'Senior AI Frontend Architect',
        ats_score: 95,
        status: 'applied',
        notes: 'Excellent matches on Framer Motion and React layout animations.',
        applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('hiresight_mock_applications', JSON.stringify(apps));
  }
};

// Execute seeding if in browser context
seedMockData();

// Chainable mock builder for database queries
class MockTableQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderCol: string | null = null;
  private orderAscending: boolean = true;
  private limitCount: number | null = null;
  private isSingle = false;
  private isMaybeSingle = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getData(): any[] {
    const raw = getStorageItem(`hiresight_mock_${this.tableName}`);
    return raw ? JSON.parse(raw) : [];
  }

  private saveData(data: any[]): void {
    setStorageItem(`hiresight_mock_${this.tableName}`, JSON.stringify(data));
  }

  select(columns: string = '*', options?: { count?: string }) {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      if (item[column] === undefined) return false;
      return String(item[column]).toLowerCase() === String(value).toLowerCase();
    });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderCol = column;
    this.orderAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  then(onfulfilled?: (value: any) => any) {
    let data = this.getData();

    // Apply filters
    for (const filter of this.filters) {
      data = data.filter(filter);
    }

    // Apply sorting
    if (this.orderCol) {
      data.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Apply limit
    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    // Handle single / maybeSingle
    let resolvedData: any = data;
    if (this.isSingle || this.isMaybeSingle) {
      resolvedData = data.length > 0 ? data[0] : null;
    }

    const result = {
      data: resolvedData,
      error: null,
      count: Array.isArray(resolvedData) ? resolvedData.length : (resolvedData ? 1 : 0)
    };

    if (onfulfilled) {
      return Promise.resolve(result).then(onfulfilled);
    }
    return Promise.resolve(result);
  }

  async insert(values: any) {
    const currentData = this.getData();
    const newItems = Array.isArray(values) ? values : [values];
    
    const createdItems = newItems.map(item => ({
      id: item.id || crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...item
    }));

    this.saveData([...currentData, ...createdItems]);
    return { data: createdItems, error: null };
  }

  async update(values: any) {
    const currentData = this.getData();
    let updatedItems: any[] = [];
    
    const updatedData = currentData.map(item => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }

      if (matches) {
        const updatedItem = { ...item, ...values, updated_at: new Date().toISOString() };
        updatedItems.push(updatedItem);
        return updatedItem;
      }
      return item;
    });

    this.saveData(updatedData);

    // Sync to active session if we are modifying the users/profiles table
    if (this.tableName === 'users' && updatedItems.length > 0) {
      const sessionStr = getStorageItem('hiresight_mock_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const currentSessionUserId = session?.user?.id;
        const matchingUpdate = updatedItems.find(item => item.id === currentSessionUserId);
        if (matchingUpdate) {
          if (matchingUpdate.role) {
            session.user.user_metadata = session.user.user_metadata || {};
            session.user.user_metadata.role = matchingUpdate.role;
          }
          if (matchingUpdate.full_name) {
            session.user.user_metadata = session.user.user_metadata || {};
            session.user.user_metadata.full_name = matchingUpdate.full_name;
          }
          setStorageItem('hiresight_mock_session', JSON.stringify(session));
        }
      }
    }

    return { data: updatedItems, error: null };
  }

  async upsert(values: any) {
    const currentData = this.getData();
    const newItems = Array.isArray(values) ? values : [values];
    const updatedData = [...currentData];

    newItems.forEach(item => {
      const idx = updatedData.findIndex(d => d.id === item.id);
      if (idx !== -1) {
        updatedData[idx] = { ...updatedData[idx], ...item, updated_at: new Date().toISOString() };
      } else {
        updatedData.push({
          id: item.id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item
        });
      }
    });

    this.saveData(updatedData);

    // Sync to active session if we are modifying the users/profiles table
    if (this.tableName === 'users') {
      const sessionStr = getStorageItem('hiresight_mock_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const currentSessionUserId = session?.user?.id;
        const matchingUpdate = newItems.find(item => item.id === currentSessionUserId);
        if (matchingUpdate) {
          if (matchingUpdate.role) {
            session.user.user_metadata = session.user.user_metadata || {};
            session.user.user_metadata.role = matchingUpdate.role;
          }
          if (matchingUpdate.full_name) {
            session.user.user_metadata = session.user.user_metadata || {};
            session.user.user_metadata.full_name = matchingUpdate.full_name;
          }
          setStorageItem('hiresight_mock_session', JSON.stringify(session));
        }
      }
    }

    return { data: newItems, error: null };
  }

  async delete() {
    const currentData = this.getData();
    const updatedData = currentData.filter(item => {
      let matches = true;
      for (const filter of this.filters) {
        if (!filter(item)) {
          matches = false;
          break;
        }
      }
      return !matches;
    });

    this.saveData(updatedData);
    return { data: [], error: null };
  }
}

// Storage bucket mockup
class MockStorageBucketBuilder {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async upload(path: string, file: any, options?: any) {
    return { data: { path }, error: null };
  }

  getPublicUrl(path: string) {
    // Generate a beautiful, standard public mock url
    return {
      data: {
        publicUrl: `/mock-pdf.pdf`
      }
    };
  }

  async remove(paths: string[]) {
    return { data: {}, error: null };
  }
}

// Storage mockup
const mockStorage = {
  from(bucketName: string) {
    return new MockStorageBucketBuilder(bucketName);
  }
};

// High-fidelity fallback auth implementation
const mockAuth = {
  // Check if a session already exists
  async getSession() {
    const sessionStr = getStorageItem('hiresight_mock_session');
    if (sessionStr) {
      return { data: { session: JSON.parse(sessionStr) }, error: null };
    }
    return { data: { session: null }, error: null };
  },

  async getUser() {
    const sessionStr = getStorageItem('hiresight_mock_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      return { data: { user: session.user }, error: null };
    }
    return { data: { user: null }, error: null };
  },

  // Dynamic Sign-Up
  async signUp({ email, password, options }: any) {
    const role = options?.data?.role || 'job_seeker';
    const fullName = options?.data?.full_name || email.split('@')[0];
    const newUserId = crypto.randomUUID();

    const authUser = {
      id: newUserId,
      email,
      password,
      role,
      full_name: fullName
    };

    // Save auth record
    const authUsersStr = getStorageItem('hiresight_mock_users_auth') || '[]';
    const authUsers = JSON.parse(authUsersStr);
    authUsers.push(authUser);
    setStorageItem('hiresight_mock_users_auth', JSON.stringify(authUsers));

    // Save user profile to users table
    const profilesStr = getStorageItem('hiresight_mock_users') || '[]';
    const profiles = JSON.parse(profilesStr);
    const profile = {
      id: newUserId,
      email,
      role,
      full_name: fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    profiles.push(profile);
    setStorageItem('hiresight_mock_users', JSON.stringify(profiles));

    // Create session
    const session = {
      access_token: `mock-token-${crypto.randomUUID()}`,
      refresh_token: `mock-refresh-token-${crypto.randomUUID()}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: newUserId,
        email,
        user_metadata: {
          role,
          full_name: fullName
        }
      }
    };

    setStorageItem('hiresight_mock_session', JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  // Dynamic and Infallible Sign-In: If the credentials don't exist yet, we automatically create/register them on the fly!
  async signInWithPassword({ email, password }: any) {
    const authUsersStr = getStorageItem('hiresight_mock_users_auth') || '[]';
    let authUsers = JSON.parse(authUsersStr);

    let authUser = authUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!authUser) {
      // 1. AUTO-REGISTRATION on the fly!
      // If the email contains recruiter or admin, set to recruiter. Otherwise seeker.
      const role = (email.toLowerCase().includes('recruiter') || email.toLowerCase().includes('admin')) ? 'recruiter' : 'job_seeker';
      const cleanName = email.split('@')[0];
      const fullName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      const newUserId = crypto.randomUUID();

      authUser = {
        id: newUserId,
        email,
        password,
        role,
        full_name: fullName
      };

      authUsers.push(authUser);
      setStorageItem('hiresight_mock_users_auth', JSON.stringify(authUsers));

      // Create profile record
      const profilesStr = getStorageItem('hiresight_mock_users') || '[]';
      const profiles = JSON.parse(profilesStr);
      profiles.push({
        id: newUserId,
        email,
        role,
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setStorageItem('hiresight_mock_users', JSON.stringify(profiles));
    } else {
      // If it exists, let them login with their password. To be incredibly forgiving, if they enter a different password, we auto-update to it!
      if (authUser.password !== password) {
        authUser.password = password;
        setStorageItem('hiresight_mock_users_auth', JSON.stringify(authUsers));
      }
    }

    // Set the active session
    const session = {
      access_token: `mock-token-${crypto.randomUUID()}`,
      refresh_token: `mock-refresh-token-${crypto.randomUUID()}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: authUser.id,
        email: authUser.email,
        user_metadata: {
          role: authUser.role,
          full_name: authUser.full_name
        }
      }
    };

    setStorageItem('hiresight_mock_session', JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

  async signInWithOAuth({ provider, options }: any) {
    // Simulate OAuth callback success immediately by logging in as a standard Google user
    const email = 'google.user@gmail.com';
    return this.signInWithPassword({ email, password: 'google-oauth' });
  },

  async signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hiresight_mock_session');
    }
    return { error: null };
  },

  async resetPasswordForEmail(email: string, options?: any) {
    return { data: {}, error: null };
  },

  onAuthStateChange(callback: any) {
    const sessionStr = getStorageItem('hiresight_mock_session');
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    
    // Call callback immediately with initial session
    callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);

    return {
      data: {
        subscription: {
          unsubscribe() {}
        }
      }
    };
  }
};

// High-fidelity Mock Supabase Client Object
const mockSupabase = {
  auth: mockAuth,
  from(tableName: string) {
    return new MockTableQueryBuilder(tableName);
  },
  storage: mockStorage,
  channel(name: string) {
    return {
      on(event: string, filter: any, callback: any) {
        return this;
      },
      subscribe(statusCallback?: (status: string) => void) {
        if (statusCallback) statusCallback("SUBSCRIBED");
        return {
          unsubscribe() {}
        };
      }
    };
  },
  removeChannel(channel: any) {
    return Promise.resolve({ error: null });
  }
};

// Core Export: Either export the real Supabase client (if online and valid) or the seamless fallback
export const supabase = shouldMock 
  ? (mockSupabase as any) 
  : originalCreateClient(supabaseUrl, supabaseAnonKey);
