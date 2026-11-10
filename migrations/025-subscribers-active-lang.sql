-- subscribe endpoint writes `active` and `lang`; prod table predates both
-- (every subscription INSERT was failing with 'no column named active').
ALTER TABLE subscribers ADD COLUMN active INTEGER DEFAULT 0;
ALTER TABLE subscribers ADD COLUMN lang TEXT DEFAULT 'en';
