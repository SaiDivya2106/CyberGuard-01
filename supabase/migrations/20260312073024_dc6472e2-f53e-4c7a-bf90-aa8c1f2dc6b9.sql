-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Threats table
CREATE TABLE public.threats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('phishing', 'malicious_link', 'scam_call', 'spam')),
  content TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  classification TEXT NOT NULL CHECK (classification IN ('Safe', 'Suspicious', 'Dangerous')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'ignored', 'blocked')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own threats" ON public.threats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own threats" ON public.threats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threats" ON public.threats FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_threats_user_id ON public.threats(user_id);
CREATE INDEX idx_threats_created_at ON public.threats(created_at DESC);
CREATE INDEX idx_threats_type ON public.threats(type);

CREATE TRIGGER update_threats_updated_at BEFORE UPDATE ON public.threats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Community reports table
CREATE TABLE public.community_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('phishing', 'malicious_link', 'scam_number')),
  content TEXT NOT NULL,
  description TEXT,
  report_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view reports" ON public.community_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own reports" ON public.community_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_community_reports_type ON public.community_reports(type);
CREATE INDEX idx_community_reports_created_at ON public.community_reports(created_at DESC);