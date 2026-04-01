import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  enterAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  enterAsGuest: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for mock guest session first
    const guestData = sessionStorage.getItem("cyberguard_guest");
    if (guestData) {
      try {
        const mockSession = JSON.parse(guestData);
        setSession(mockSession);
        setLoading(false);
      } catch (e) {
        console.error("Guest session parse error", e);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!sessionStorage.getItem("cyberguard_guest")) {
        setSession(newSession);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!sessionStorage.getItem("cyberguard_guest")) {
        setSession(currentSession);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const enterAsGuest = () => {
    const mockSession = {
      access_token: "guest_token",
      user: {
        id: "guest-id",
        email: "demo-guest@cyberguard.demo",
        user_metadata: { full_name: "Demo Guest" },
      },
    } as any;
    sessionStorage.setItem("cyberguard_guest", JSON.stringify(mockSession));
    setSession(mockSession);
  };

  const signOut = async () => {
    sessionStorage.removeItem("cyberguard_guest");
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut, enterAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
