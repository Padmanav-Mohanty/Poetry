-- Seed data for the Verse / Poetry app.
-- Run AFTER schema.sql:
--   psql "$DATABASE_URL" -f db/seed.sql
--
-- This is idempotent: re-running it won't create duplicates.

-- ---------------------------------------------------------------------------
-- Poetry forms (lookup table). Order matches the original poems.ts list.
-- ---------------------------------------------------------------------------
INSERT INTO poetry_forms (name, icon, sort_order) VALUES
  ('Free Verse',   '🌊', 1),
  ('Sonnet',       '🌹', 2),
  ('Haiku',        '🍃', 3),
  ('Villanelle',   '🌀', 4),
  ('Ode',          '🔥', 5),
  ('Ghazal',       '🌙', 6),
  ('Limerick',     '🎭', 7),
  ('Blank Verse',  '📜', 8)
ON CONFLICT (name) DO UPDATE SET icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order;

-- ---------------------------------------------------------------------------
-- The 8 poems originally hardcoded in src/data/poems.ts.
-- All inserted as status = 'approved', submission_mode = 'seed', since they
-- were already live on the site before the DB existed.
-- ---------------------------------------------------------------------------

INSERT INTO poems (
  title, author, slug, form, language, description,
  cover_color_1, cover_color_2, cover_color_3,
  readers, lines, uploaded_at, featured, status, submission_mode, content
) VALUES
(
  'What the River Keeps', 'Elena Marsh', 'what-the-river-keeps', 'Free Verse', 'English',
  'A meditation on memory and erosion, written for a grandmother who measured her life in floods.',
  '#8B4513', '#C0702A', '#6B3410',
  2841, 24, '2026-05-02', TRUE, 'approved', 'seed',
$$My grandmother named the floods like children —
the year of the lost shoe, the year the bridge gave way,
the year she carried the radio above her head
through water that wanted her ankles, then her knees.

She said the river never took anything
it didn't first ask permission for,
in its own slow language of rising,
which none of us were patient enough to learn.

I used to think she meant the water literally.
Now I think she meant every river —
the ones in the chest, the ones in the throat,
the ones that rise for years before anyone notices
the floor is already gone.

When she died, I went down to the bank
and didn't say anything dramatic.
I just stood there the way she used to,
ankles in the cold, counting nothing,
and let it ask me whatever it wanted to ask.

The water didn't take anything that day.
It only listened,
the way she always said it would,
if you stood still long enough to be heard.$$
),
(
  'Instructions for Staying', 'Mira Kohen', 'instructions-for-staying', 'Free Verse', 'English',
  'A quiet list-poem about grief, written in the voice of someone learning to remain in a life that has changed shape.',
  '#2D5016', '#4A7C25', '#1A3009',
  1240, 18, '2026-04-18', FALSE, 'approved', 'seed',
$$Water the plant even on the days
you forget why you're still doing it.

Leave the porch light on
for a guest who isn't coming back,
just so the house remembers
how to welcome someone.

Say the name out loud sometimes,
not to summon anything,
just so your mouth
doesn't forget the shape of it.

Let the silence finish its sentence
before you fill it with something smaller.

Some rooms will stay closed for a while.
That's allowed.

The garden doesn't need you to explain
why you've come back to it.
It only needs you to come back.$$
),
(
  'Ember & Vow', 'Priya Nair', 'ember-and-vow', 'Sonnet', 'English',
  'A sonnet about two sisters bound by fire and divided by war, written in the voice of the one who stayed.',
  '#5c1a1a', '#8f2a2a', '#400d0d',
  2104, 14, '2026-06-01', FALSE, 'approved', 'seed',
$$They told me fire chooses what is dry,
and called our village kindling, called it fair.
You wore their colors; I could not deny
the smoke that hung between us like despair.

I kept the cloak you left, too large for me,
a kind of armor stitched from your goodbye.
I learned to read the embers like a sea
of every reason I refused to die.

We do not speak the names of what we lost —
the wall still stands, though neither side has won.
I think of you each time I count the cost
of choosing ash instead of being one.

If fire still remembers who it spared,
let it remember, too, that we once cared.$$
),
(
  'Cold Case', 'Sam Wells', 'cold-case', 'Free Verse', 'English',
  'A noir-tinged poem about returning to a hometown and a truth that was filed away too soon.',
  '#1a1a3a', '#2a2a6f', '#0d0d2a',
  673, 16, '2026-03-22', FALSE, 'approved', 'seed',
$$The town kept the case the way towns keep things —
folded small, placed somewhere dark, called closed.

I came back smelling like a city
that forgets faster than this one does.

Twenty years and the file's still thin,
thin the way a story gets
when everyone already agreed
on which lie to believe.

I am not looking for the truth
because I think it will be kind.
I am looking for it
because thin files
make for thin sleep,
and I am tired
of dreaming in other people's silence.$$
),
(
  'What the Vineyard Knows', 'Claire Donovan', 'what-the-vineyard-knows', 'Free Verse', 'English',
  'A poem about two rival neighbors, a fallen fence, and the slow thaw of a decade-long grudge.',
  '#6B3410', '#A0522D', '#3a1c08',
  3201, 16, '2026-05-29', FALSE, 'approved', 'seed',
$$The fence fell in one night of wind
and took ten years of distance with it.

We stood in the wreckage like two people
who had forgotten they once shared a horizon.

Roots don't know about property lines.
They've been touching underground
the whole time we called each other enemy
from opposite sides of a fence
neither of us built.

Maybe the storm wasn't an accident.
Maybe the land got tired
of holding a grudge
we were too proud to put down ourselves.$$
),
(
  'The Star That Wasn''t There', 'Olusegun Bello', 'the-star-that-wasnt-there', 'Free Verse', 'English',
  'A science-fiction-tinged poem about a navigator trusting an instrument no one else believes, on a four-hundred-year voyage.',
  '#1a2e3a', '#2a4f6f', '#0d1f2a',
  1558, 18, '2026-02-14', FALSE, 'approved', 'seed',
$$Four hundred years of charts agreed
on a single point of light.
Then, one cycle, the point was gone,
and no one but me noticed
the sky had changed its mind.

They tell me stars don't vanish.
I tell them I have spent my whole life
trusting instruments
over the comfort of consensus.

Six thousand people sleep below me,
dreaming of a destination
that may no longer exist
the way they were promised it would.

I keep adjusting the course anyway —
not because I'm certain,
but because someone on this ship
has to keep believing in arrival
long enough for the rest to wake up.$$
),
(
  'Letters in a Tin Box', 'Yuki Tanaka', 'letters-in-a-tin-box', 'Free Verse', 'English',
  'A poem about a grandmother''s wartime letters, and the quiet bravery folded into small, careful handwriting.',
  '#4a3010', '#7a5020', '#2a1a08',
  447, 16, '2026-01-30', FALSE, 'approved', 'seed',
$$The tin box smelled like rust and salt
and forty years of being almost thrown away.

Her handwriting grew smaller with each letter,
as if she were trying to take up less room
in a world that had already taken so much from her.

I read about a woman I never met
who happened to share my grandmother's name —
braver, quieter, more afraid,
more certain than the woman who raised me
ever let herself appear.

I folded the last letter back along its old crease
and understood, finally,
that some inheritances
arrive only after the person
who carried them is gone.$$
),
(
  'House of Glass', 'Dana Reeves', 'house-of-glass', 'Free Verse', 'English',
  'An unsettling poem about a family moving into a transparent house, and the slow realization that something inside the walls is watching back.',
  '#2a2a2a', '#4a4a4a', '#1a1a1a',
  918, 14, '2026-06-15', FALSE, 'approved', 'seed',
$$They called it a once-in-a-lifetime view —
glass instead of walls,
nothing between us and the road
but our own reflections, staring back.

My daughter wouldn't look up
past the second floor.
I told myself that was just the light,
the way glass holds a shape
a little longer than it should.

By the third night I understood
the house was not reflecting me.
It was learning me —
practicing my face
in the dark on the other side of the pane.$$
)
ON CONFLICT (slug) DO NOTHING;
