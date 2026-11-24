-- Module 4 lab: the tasks table for the Student Task Manager
-- (run once in the Supabase SQL Editor of the class project)
CREATE TABLE tasks (
  id         bigserial PRIMARY KEY,
  user_id    uuid,
  title      text,
  done       boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Turn on row-level security for this table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Rule: a logged-in user can see and change ONLY their own rows
CREATE POLICY "users manage own tasks"
ON tasks FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
