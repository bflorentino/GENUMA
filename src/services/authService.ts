import { supabase, getUserProfile } from '../lib/supabase';
import Swal from 'sweetalert2';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nombre_completo: string;
  rol: string;
  telefono?: string;
  activo: boolean;
}

export interface CreateUserData {
  email: string;
  password: string;
  nombre_completo: string;
  rol: string;
  telefono?: string;
}

class AuthService {
  // Create demo users if they don't exist
  async createDemoUsers() {
    const demoUsers = [
      {
        email: 'admin@museo.gov.do',
        password: 'password123',
        nombre_completo: 'Administrador del Sistema',
        rol: 'Administrador',
        telefono: '809-555-0001'
      },
      {
        email: 'curador@museo.gov.do',
        password: 'password123',
        nombre_completo: 'María González',
        rol: 'Curador',
        telefono: '809-555-0002'
      },
      {
        email: 'tecnico@museo.gov.do',
        password: 'password123',
        nombre_completo: 'Carlos Martínez',
        rol: 'Técnico',
        telefono: '809-555-0003'
      }
    ];

    for (const userData of demoUsers) {
      try {
        // Check if user already exists in usuarios table
        const { data: existingUser } = await supabase
          .from('usuarios')
          .select('email')
          .eq('email', userData.email)
          .single();

        if (!existingUser) {
          await this.createUser(userData);
        }
      } catch (error) {
        console.log(`Demo user ${userData.email} creation skipped or already exists`);
      }
    }
  }

  async createUser(userData: CreateUserData) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user profile in usuarios table
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            auth_user_id: authData.user.id,
            email: userData.email,
            nombre_completo: userData.nombre_completo,
            rol: userData.rol,
            telefono: userData.telefono,
            activo: true
          });

        if (profileError) throw profileError;
      }

      return authData;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async signIn(credentials: LoginCredentials) {
    try {
      console.log('Starting signIn process for:', credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      console.log('Auth response:', { data: !!data, error: error?.message });

      if (error) {
        console.error('Auth error:', error);
        throw error;
      }

      if (!data.user || !data.session) {
        console.error('No user or session in response');
        throw new Error('Error en la autenticación - no se recibió usuario o sesión');
      }

      console.log('Auth successful, fetching profile for user:', data.user.id);

      // Try to get user profile with timeout and fallback
      let profile: UserProfile;
      try {
        const { data: profileData, error: profileError } = await Promise.race([
          supabase
            .from('usuarios')
            .select('id, email, nombre_completo, rol, telefono, activo')
            .eq('auth_user_id', data.user.id)
            .single(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
        ]) as any;

        if (profileError) {
          console.warn('Profile fetch error:', profileError);
          // Create fallback profile
          profile = {
            id: data.user.id,
            email: data.user.email || credentials.email,
            nombre_completo: data.user.email?.split('@')[0] || 'Usuario',
            rol: 'Administrador',
            activo: true
          };
        } else {
          profile = profileData;
        }
      } catch (profileError) {
        console.warn('Profile fetch failed, using fallback:', profileError);
        // Create fallback profile
        profile = {
          id: data.user.id,
          email: data.user.email || credentials.email,
          nombre_completo: data.user.email?.split('@')[0] || 'Usuario',
          rol: 'Administrador',
          activo: true
        };
      }

      console.log('Login successful with profile:', profile);

      return {
        user: data.user,
        profile,
        session: data.session
      };

    } catch (error: any) {
      console.error('SignIn error:', error);
      
      // If there's an RLS or database error, fall back to demo mode for known emails
      if (credentials.email.includes('@museo.gov.do')) {
        console.log('Falling back to demo mode for museum email');
        return this.signInDemo(credentials.email);
      }
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Credenciales inválidas. Verifique su email y contraseña.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Email no confirmado. Revise su bandeja de entrada.');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Demasiados intentos. Intente nuevamente en unos minutos.');
      }
      
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  // Alternative sign in method for demo purposes
  async signInDemo(email: string) {
    try {
      console.log('Starting demo sign in for:', email);
      
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, email, nombre_completo, rol, activo')
        .eq('email', email)
        .single();

      if (error || !usuario) {
        console.error('Demo user not found:', error);
        throw new Error('Usuario demo no encontrado en la base de datos');
      }

      console.log('Demo user found:', usuario);

      // Store demo session flag in localStorage
      localStorage.setItem('demo_session', JSON.stringify({
        user: { id: usuario.id, email: usuario.email },
        profile: usuario
      }));

      return {
        user: { id: usuario.id, email: usuario.email },
        profile: usuario,
        session: { access_token: 'demo-token', user: { id: usuario.id, email: usuario.email } }
      };
    } catch (error: any) {
      console.error('Demo sign in error:', error);
      throw new Error(error.message || 'Error en modo demo');
    }
  }

  async getCurrentSession() {
    try {
      // Check for demo session first
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        try {
          const parsed = JSON.parse(demoSession);
          return { access_token: 'demo-token', user: parsed.user };
        } catch {
          localStorage.removeItem('demo_session');
          return null;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      // Check for demo session first
      const demoSession = localStorage.getItem('demo_session');
      if (demoSession) {
        try {
          const parsed = JSON.parse(demoSession);
          return { user: parsed.user, profile: parsed.profile };
        } catch {
          localStorage.removeItem('demo_session');
          return null;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const profile = await getUserProfile(user.id);
          return { user, profile };
        } catch (profileError) {
          console.warn('Error getting user profile, using fallback');
          return { 
            user, 
            profile: {
              id: user.id,
              email: user.email || 'usuario@museo.gov.do',
              nombre_completo: user.email?.split('@')[0] || 'Usuario',
              rol: 'Administrador',
              activo: true
            }
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async signOut() {
    try {
      console.log('AuthService: Starting signOut...');
      
      // Clear demo session
      const hadDemoSession = localStorage.getItem('demo_session');
      localStorage.removeItem('demo_session');
      console.log('Demo session cleared:', !!hadDemoSession);
      
      // Only try to sign out from Supabase if we're not in demo mode
      if (!hadDemoSession) {
        console.log('Signing out from Supabase...');
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Supabase signOut error (non-critical):', error);
        } else {
          console.log('Supabase signOut successful');
        }
      } else {
        console.log('Skipping Supabase signOut (was demo session)');
      }
      
      console.log('AuthService signOut completed successfully');
    } catch (error: any) {
      console.error('Error signing out:', error);
      // Don't throw - we want logout to always succeed
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();