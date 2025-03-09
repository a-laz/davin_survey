/*
  # Create survey responses table

  1. New Tables
    - `survey_responses`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `email` (text)
      - `company` (text)
      - `role` (text)
      - `current_bim_tools` (text array)
      - `challenges` (text)
      - `desired_features` (text array)
      - `data_visualization` (text)
      - `unreal_experience` (text)
      - `additional_comments` (text)
  2. Security
    - Enable RLS on `survey_responses` table
    - Add policy for anonymous users to insert data
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role text NOT NULL,
  current_bim_tools text[] DEFAULT '{}',
  challenges text,
  desired_features text[] DEFAULT '{}',
  data_visualization text,
  unreal_experience text,
  additional_comments text
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert data (for the public survey)
CREATE POLICY "Anyone can insert survey responses"
  ON survey_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only allow authenticated users to read their own data
CREATE POLICY "Authenticated users can read their own survey responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE email = survey_responses.email
  ));