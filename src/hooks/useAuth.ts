import { useState, useEffect } from 'react';
import { authService, UserProfile } from '../services/authService';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    profile: null,
    session: null,
    loading: true
  });

  // Initialize auth once
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const currentUser = await authService.getCurrentUser();
        const session = await authService.getCurrentSession();

        console.log('Auth initialization result:', { 
          hasUser: !!currentUser, 
          hasSession: !!session 
        });

        if (currentUser && session) {
          setAuthState({
            isAuthenticated: true,
            user: currentUser.user,
            profile: currentUser.profile,
            session,
            loading: false
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            profile: null,
            session: null,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          profile: null,
          session: null,
          loading: false
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    
    try {
      // Set loading state immediately
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const result = await authService.signIn({ email, password });
      
      console.log('Login successful, updating state');

      // Update state immediately after successful login
      setAuthState({
        isAuthenticated: true,
        user: result.user,
        profile: result.profile,
        session: result.session,
        loading: false
      });

      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      // Always set loading to false on error
      setAuthState(prev => ({ 
        ...prev, 
        loading: false,
        isAuthenticated: false,
        user: null,
        profile: null,
        session: null
      }));
      
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      // Clear demo session flag
      localStorage.removeItem('demo_session');
      setAuthState({
        isAuthenticated: false,
        user: null,
        profile: null,
        session: null,
        loading: false
      });
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if there's an error, clear the auth state to force redirect to login
      setAuthState({
        isAuthenticated: false,
        user: null,
        profile: null,
        session: null,
        loading: false
      });
    }
  };

  return { ...authState, login, logout };
};