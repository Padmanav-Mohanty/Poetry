import { Poem, PoetryForm } from "@/types"

export const poems: Poem[] = [
  {
    id: "1",
    title: "What the River Keeps",
    author: "Elena Marsh",
    slug: "what-the-river-keeps",
    form: "Free Verse",
    language: "English",
    description:
      "A meditation on memory and erosion, written for a grandmother who measured her life in floods.",
    coverColor: ["#8B4513", "#C0702A", "#6B3410"],
    readers: 2841,
    lines: 24,
    uploadedAt: "2026-05-02",
    featured: true,
    content: `My grandmother named the floods like children —
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
if you stood still long enough to be heard.`,
  },
  {
    id: "2",
    title: "Instructions for Staying",
    author: "Mira Kohen",
    slug: "instructions-for-staying",
    form: "Free Verse",
    language: "English",
    description:
      "A quiet list-poem about grief, written in the voice of someone learning to remain in a life that has changed shape.",
    coverColor: ["#2D5016", "#4A7C25", "#1A3009"],
    readers: 1240,
    lines: 18,
    uploadedAt: "2026-04-18",
    content: `Water the plant even on the days
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
It only needs you to come back.`,
  },
  {
    id: "3",
    title: "Ember & Vow",
    author: "Priya Nair",
    slug: "ember-and-vow",
    form: "Sonnet",
    language: "English",
    description:
      "A sonnet about two sisters bound by fire and divided by war, written in the voice of the one who stayed.",
    coverColor: ["#5c1a1a", "#8f2a2a", "#400d0d"],
    readers: 2104,
    lines: 14,
    uploadedAt: "2026-06-01",
    content: `They told me fire chooses what is dry,
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
let it remember, too, that we once cared.`,
  },
  {
    id: "4",
    title: "Cold Case",
    author: "Sam Wells",
    slug: "cold-case",
    form: "Free Verse",
    language: "English",
    description:
      "A noir-tinged poem about returning to a hometown and a truth that was filed away too soon.",
    coverColor: ["#1a1a3a", "#2a2a6f", "#0d0d2a"],
    readers: 673,
    lines: 16,
    uploadedAt: "2026-03-22",
    content: `The town kept the case the way towns keep things —
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
of dreaming in other people's silence.`,
  },
  {
    id: "5",
    title: "What the Vineyard Knows",
    author: "Claire Donovan",
    slug: "what-the-vineyard-knows",
    form: "Free Verse",
    language: "English",
    description:
      "A poem about two rival neighbors, a fallen fence, and the slow thaw of a decade-long grudge.",
    coverColor: ["#6B3410", "#A0522D", "#3a1c08"],
    readers: 3201,
    lines: 16,
    uploadedAt: "2026-05-29",
    content: `The fence fell in one night of wind
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
we were too proud to put down ourselves.`,
  },
  {
    id: "6",
    title: "The Star That Wasn't There",
    author: "Olusegun Bello",
    slug: "the-star-that-wasnt-there",
    form: "Free Verse",
    language: "English",
    description:
      "A science-fiction-tinged poem about a navigator trusting an instrument no one else believes, on a four-hundred-year voyage.",
    coverColor: ["#1a2e3a", "#2a4f6f", "#0d1f2a"],
    readers: 1558,
    lines: 18,
    uploadedAt: "2026-02-14",
    content: `Four hundred years of charts agreed
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
long enough for the rest to wake up.`,
  },
  {
    id: "7",
    title: "Letters in a Tin Box",
    author: "Yuki Tanaka",
    slug: "letters-in-a-tin-box",
    form: "Free Verse",
    language: "English",
    description:
      "A poem about a grandmother's wartime letters, and the quiet bravery folded into small, careful handwriting.",
    coverColor: ["#4a3010", "#7a5020", "#2a1a08"],
    readers: 447,
    lines: 16,
    uploadedAt: "2026-01-30",
    content: `The tin box smelled like rust and salt
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
who carried them is gone.`,
  },
  {
    id: "8",
    title: "House of Glass",
    author: "Dana Reeves",
    slug: "house-of-glass",
    form: "Free Verse",
    language: "English",
    description:
      "An unsettling poem about a family moving into a transparent house, and the slow realization that something inside the walls is watching back.",
    coverColor: ["#2a2a2a", "#4a4a4a", "#1a1a1a"],
    readers: 918,
    lines: 14,
    uploadedAt: "2026-06-15",
    content: `They called it a once-in-a-lifetime view —
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
in the dark on the other side of the pane.`,
  },
]

export const poetryForms: PoetryForm[] = [
  { name: "Free Verse", icon: "🌊", count: 84 },
  { name: "Sonnet", icon: "🌹", count: 47 },
  { name: "Haiku", icon: "🍃", count: 61 },
  { name: "Villanelle", icon: "🌀", count: 22 },
  { name: "Ode", icon: "🔥", count: 38 },
  { name: "Ghazal", icon: "🌙", count: 29 },
  { name: "Limerick", icon: "🎭", count: 19 },
  { name: "Blank Verse", icon: "📜", count: 33 },
]
