
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Tenant = Database['public']['Tables']['tenants']['Row'];

type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff" | "tenant" | "visitor";
  profile?: Profile;
  tenant?: Tenant;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: { 
    first_name: string; 
    last_name: string; 
    phone?: string;
    role?: "admin" | "staff" | "tenant";
  }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Get tenant data if user is a tenant and has tenant_id
      let tenant = null;
      if (profile?.tenant_id) {
        const { data: tenantData, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenantError) {
          console.error('Error fetching tenant:', tenantError);
        } else {
          tenant = tenantData;
        }
      }

      // If user is a tenant but no tenant record exists, try to find by email
      if (profile?.role === 'tenant' && !tenant) {
        const { data: tenantByEmail, error: tenantByEmailError } = await supabase
          .from('tenants')
          .select('*')
          .eq('auth_email', userEmail)
          .single();

        if (!tenantByEmailError && tenantByEmail) {
          tenant = tenantByEmail;
          
          // Update profile with tenant_id
          await supabase
            .from('profiles')
            .update({ tenant_id: tenant.id })
            .eq('id', userId);
        }
      }

      return {
        id: userId,
        email: userEmail,
        name: tenant ? `${tenant.first_name} ${tenant.last_name}` : userEmail,
        role: profile.role as "admin" | "staff" | "tenant" | "visitor",
        profile,
        tenant
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(session.user.id, session.user.email!);
            setUser(userProfile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        fetchUserProfile(session.user.id, session.user.email!).then((userProfile) => {
          setUser(userProfile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    // User profile will be set by the auth state change listener
  };

  const signup = async (email: string, password: string, userData?: { 
    first_name: string; 
    last_name: string; 
    phone?: string;
    role?: "admin" | "staff" | "tenant";
  }) => {
    setLoading(true);
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    // If user data is provided, create tenant record and update profile
    if (data.user && userData) {
      try {
        let tenant = null;
        
        // Create tenant record if role is tenant or not specified
        if (!userData.role || userData.role === 'tenant') {
          const { data: tenantData, error: tenantError } = await supabase
            .from('tenants')
            .insert({
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: email,
              phone: userData.phone,
              auth_email: email,
            })
            .select()
            .single();

          if (tenantError) {
            console.error('Error creating tenant:', tenantError);
          } else {
            tenant = tenantData;
          }
        }

        // Update profile with role and tenant_id (if applicable)
        const profileUpdates: any = { 
          role: userData.role || 'tenant' 
        };
        
        if (tenant) {
          profileUpdates.tenant_id = tenant.id;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      } catch (error) {
        console.error('Error in signup process:', error);
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
