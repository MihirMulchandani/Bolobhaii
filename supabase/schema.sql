-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  category text NOT NULL CHECK (category IN ('spicy','romantic','funny','shocking','random')),
  identity text NOT NULL,
  identity_slug text NOT NULL,
  ip inet,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  reactions_count int DEFAULT 0,
  comments_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id uuid REFERENCES confessions(id) ON DELETE CASCADE,
  text text NOT NULL,
  identity text NOT NULL,
  identity_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id uuid REFERENCES confessions(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  identity text NOT NULL,
  identity_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user text NOT NULL,
  action text NOT NULL,
  target_id uuid,
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_confessions_status ON confessions(status);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at);
CREATE INDEX IF NOT EXISTS idx_confessions_reactions_count ON confessions(reactions_count);
CREATE INDEX IF NOT EXISTS idx_confessions_identity_slug ON confessions(identity_slug);

-- Maintain counters via triggers
CREATE OR REPLACE FUNCTION trg_inc_comments() RETURNS TRIGGER AS $$
BEGIN
  UPDATE confessions SET comments_count = comments_count + 1 WHERE id = NEW.confession_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_dec_comments() RETURNS TRIGGER AS $$
BEGIN
  UPDATE confessions SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.confession_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_inc_reactions() RETURNS TRIGGER AS $$
BEGIN
  UPDATE confessions SET reactions_count = reactions_count + 1 WHERE id = NEW.confession_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_dec_reactions() RETURNS TRIGGER AS $$
BEGIN
  UPDATE confessions SET reactions_count = GREATEST(reactions_count - 1, 0) WHERE id = OLD.confession_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_inc ON comments;
CREATE TRIGGER comments_inc AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION trg_inc_comments();
DROP TRIGGER IF EXISTS comments_dec ON comments;
CREATE TRIGGER comments_dec AFTER DELETE ON comments FOR EACH ROW EXECUTE FUNCTION trg_dec_comments();

DROP TRIGGER IF EXISTS reactions_inc ON reactions;
CREATE TRIGGER reactions_inc AFTER INSERT ON reactions FOR EACH ROW EXECUTE FUNCTION trg_inc_reactions();
DROP TRIGGER IF EXISTS reactions_dec ON reactions;
CREATE TRIGGER reactions_dec AFTER DELETE ON reactions FOR EACH ROW EXECUTE FUNCTION trg_dec_reactions();


