-- MSME Operations Management System Database Schema

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  skills TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources/Inventory table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  minimum_threshold INTEGER NOT NULL DEFAULT 10,
  unit TEXT DEFAULT 'units',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  deadline TIMESTAMPTZ,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Decisions table
CREATE TABLE IF NOT EXISTS public.ai_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  description TEXT NOT NULL,
  reasoning TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  resource_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory alerts table
CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for resources
CREATE POLICY "resources_select_all" ON public.resources FOR SELECT USING (true);
CREATE POLICY "resources_insert_auth" ON public.resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "resources_update_auth" ON public.resources FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "resources_delete_auth" ON public.resources FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for tasks
CREATE POLICY "tasks_select_all" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "tasks_insert_auth" ON public.tasks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "tasks_update_auth" ON public.tasks FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "tasks_delete_auth" ON public.tasks FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for ai_decisions
CREATE POLICY "ai_decisions_select_all" ON public.ai_decisions FOR SELECT USING (true);
CREATE POLICY "ai_decisions_insert_auth" ON public.ai_decisions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ai_decisions_update_auth" ON public.ai_decisions FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for inventory_alerts
CREATE POLICY "inventory_alerts_select_all" ON public.inventory_alerts FOR SELECT USING (true);
CREATE POLICY "inventory_alerts_insert_auth" ON public.inventory_alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "inventory_alerts_update_auth" ON public.inventory_alerts FOR UPDATE USING (auth.uid() IS NOT NULL);
