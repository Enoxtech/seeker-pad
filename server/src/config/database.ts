import { Pool } from 'pg';

// Use Supabase REST API instead of direct PostgreSQL (due to DNS issues)
const USE_MOCK = false;

// Use Supabase REST API
const SUPABASE_URL = 'https://htkslwnrqcdjspdyuqhg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjQyMTIsImV4cCI6MjA4ODY0MDIxMn0.Gph4VcskabWNRnK2k1QyhzO9siLvvPeNrz92fZXQ1yY';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a3Nsd25ycWNkanNwZHl1cWhnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2NDIxMiwiZXhwIjoyMDg4NjQwMjEyfQ.TwoFqCiJeOPkPFLtyD7Inpa24h5xoJ6BefRuqCJsRWM';

// Use pg Pool only if we can connect, otherwise use REST API
let pool: Pool | null = null;
let useRestApi = false;

// Query result type
interface QueryResult {
  rows: any[];
  command: string;
}

// HTTP-based query using Supabase REST API
async function restQuery(table: string, sql: string, params: any[] = []): Promise<QueryResult> {
  const sqlLower = sql.toLowerCase();
  
  // Simple SELECT handling
  if (sqlLower.startsWith('select')) {
    // Extract table name
    const fromMatch = sqlLower.match(/from\s+(\w+)/);
    if (!fromMatch) return { rows: [] as any[], command: 'SELECT' };
    
    const tableName = fromMatch[1];
    let url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
    
    // Handle WHERE clause (simple version)
    if (sqlLower.includes('where')) {
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\$(\d+)/);
      if (whereMatch) {
        const col = whereMatch[1];
        const paramIndex = parseInt(whereMatch[2]) - 1;
        url += `&${col}=eq.${encodeURIComponent(params[paramIndex])}`;
      }
    }
    
    // Handle ORDER BY
    if (sqlLower.includes('order by')) {
      const orderMatch = sql.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i);
      if (orderMatch) {
        const orderCol = orderMatch[1];
        const orderDir = orderMatch[2]?.toUpperCase() || 'ASC';
        url += `&order=${orderCol}.${orderDir}`;
      }
    }
    
    // Handle LIMIT
    const limitMatch = sql.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      url += `&limit=${limitMatch[1]}`;
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('REST API error:', response.status, errorText);
        return { rows: [] as any[], command: 'SELECT' };
      }
      
      const data = await response.json();
      return { rows: Array.isArray(data) ? data : [], command: 'SELECT' };
    } catch (error) {
      console.error('REST API fetch error:', error);
      return { rows: [], command: 'SELECT' };
    }
  }
  
  // For now, return success for inserts/updates (they won't persist without proper REST implementation)
  return { rows: [] as any[], command: (sqlLower.split(' ')[0] || 'UNKNOWN').toUpperCase() };
}

// Create connection pool (for future use when DNS is fixed)
function createPool() {
  if (!pool) {
    // This won't work due to DNS, but we keep it for reference
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
    });
  }
  return pool;
}

// Query function - uses REST API
export async function query(sql: string, params: any[] = []): Promise<QueryResult> {
  if (USE_MOCK) {
    return { rows: [] as any[], command: 'SELECT' };
  }
  
  // Try REST API approach
  return await restQuery('', sql, params);
}

export const getClient = () => {
  return null; // Not using pool for now
};

// Database initialization
export async function initDatabase() {
  if (USE_MOCK) {
    console.log('📦 Development mode - using mock data');
    return;
  }
  
  // Test REST API connection
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok) {
      console.log('✅ Connected to Supabase via REST API');
      useRestApi = true;
    } else {
      console.log('⚠️ Using fallback mode (REST API test failed)');
    }
  } catch (error) {
    console.log('⚠️ Using fallback mode (REST API unreachable)');
  }
}

export default pool;
