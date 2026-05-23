-- BTR Content Seed — site_settings + blog posts
-- Run in Supabase SQL editor.

-- ── Update site_settings ───────────────────────────────────────
INSERT INTO site_settings (
  id,
  hero_headline,
  hero_copy,
  hero_primary_cta_label,
  hero_primary_cta_url,
  hero_secondary_cta_label,
  hero_secondary_cta_url,
  impact_stats,
  instagram_url,
  facebook_url,
  linkedin_url,
  footer_tagline,
  homepage_sections,
  updated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',

  'Mental Health & Behavioural Change for Young People Across Africa.',

  'Behind the Reels is a pioneering mental health initiative empowering young people to understand, embrace, and invest in their mental health through storytelling, authentic dialogues, and ground-level community outreaches.',

  'Read Stories',
  '/stories',
  'Submit Your Story',
  '/submit',

  '[
    {"value": "1M+",    "label": "people reached through stories and conversations"},
    {"value": "200+",   "label": "community stories shared across Africa"},
    {"value": "95%",    "label": "of participants report better mental health understanding"},
    {"value": "34,000", "label": "young people reached through direct outreaches"}
  ]'::jsonb,

  'https://www.instagram.com/behindthereels.co/',
  'https://www.facebook.com/behindthereels',
  'https://www.linkedin.com/company/behindthereels',

  'African, for Africans by Africans.',

  '[
    {"id": "stories",   "label": "Stories",   "visible": true, "order": 1},
    {"id": "dialogues", "label": "Dialogues", "visible": true, "order": 2},
    {"id": "outreach",  "label": "Outreach",  "visible": true, "order": 3},
    {"id": "resources", "label": "Resources", "visible": true, "order": 4}
  ]'::jsonb,

  now()
)
ON CONFLICT (id) DO UPDATE SET
  hero_headline            = EXCLUDED.hero_headline,
  hero_copy                = EXCLUDED.hero_copy,
  hero_primary_cta_label   = EXCLUDED.hero_primary_cta_label,
  hero_primary_cta_url     = EXCLUDED.hero_primary_cta_url,
  hero_secondary_cta_label = EXCLUDED.hero_secondary_cta_label,
  hero_secondary_cta_url   = EXCLUDED.hero_secondary_cta_url,
  impact_stats             = EXCLUDED.impact_stats,
  instagram_url            = EXCLUDED.instagram_url,
  facebook_url             = EXCLUDED.facebook_url,
  linkedin_url             = EXCLUDED.linkedin_url,
  footer_tagline           = EXCLUDED.footer_tagline,
  homepage_sections        = EXCLUDED.homepage_sections,
  updated_at               = EXCLUDED.updated_at;


-- ── Seed author: Rebecca Najjuma ──────────────────────────────
INSERT INTO authors (id, name, bio, created_at)
VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'Rebecca Najjuma',
  'Rebecca Najjuma is a mental health advocate, writer, and community builder working with Behind the Reels. Her writing explores grief, identity, family pressure, and the everyday emotional lives of young Africans.',
  now()
)
ON CONFLICT (id) DO NOTHING;


-- ── Seed 5 blog posts ─────────────────────────────────────────
-- Note: body is stored as jsonb { "html": "..." } — see admin/blog/actions.ts

INSERT INTO blog_posts (id, title, slug, excerpt, body, author_id, published_at, featured, view_count, created_at)
VALUES

(
  'b0000001-0000-0000-0000-000000000001',
  'Why We Don''t Talk About Mental Health at Home — And Why That Has to Change',
  'why-we-dont-talk-about-mental-health-at-home',
  'In many African homes, emotional struggles are met with silence, prayer, or "you just need to be strong." But what happens when staying silent becomes the illness itself?',
  jsonb_build_object('html', '<p>There is a sentence many of us grew up hearing: <em>"We don''t talk about those things."</em></p><p>It covered everything — grief, fear, anxiety, the feeling of not being enough. It was not cruelty. It was survival. Our parents, and their parents before them, lived through things that required you to simply keep going. Feeling and processing were luxuries they could not afford.</p><p>But the world has changed. The pressures on young Africans today are different: social media comparison, academic intensity, unemployment anxiety, identity confusion, and a culture that still tells us that softness is weakness.</p><h2>The Cost of Silence</h2><p>When we cannot name what we are feeling, it does not disappear. It relocates — into our bodies as tension, into our relationships as anger, into our choices as self-sabotage. Silence does not protect us. It just makes the pain quieter and lonelier.</p><p>At Behind the Reels, we hear from hundreds of young Africans every year who say the same thing: <em>"I thought I was the only one who felt this way."</em> The moment they read someone else''s story, something unlocks. They realise their suffering is not strange. It is not shameful. It is human.</p><h2>What Change Looks Like</h2><p>We are not asking families to become therapy sessions overnight. Change starts small: asking "how are you really doing?" instead of "how is school?" Listening without immediately offering solutions. Not treating a child''s emotional breakdown as a performance.</p><p>The generation of young Africans we are speaking to is hungry for this. They want to heal. They want to talk. They need communities, families, and cultures that give them permission to do so.</p><p>Behind the Reels exists to create that permission — one story at a time.</p>'),
  'a0000001-0000-0000-0000-000000000001',
  now() - interval '30 days',
  true,
  0,
  now() - interval '30 days'
),

(
  'b0000002-0000-0000-0000-000000000002',
  'The Pressure to Perform: On Being the "Strong One" in Your Family',
  'the-pressure-to-perform-being-the-strong-one',
  'Being the firstborn, the responsible one, the one who never cries — it carries a weight no one prepared you for. And yet, the role was never yours to choose.',
  jsonb_build_object('html', '<p>You did not apply for the job. But somehow, it became yours.</p><p>The strong one. The responsible one. The one everyone calls when things fall apart. You have been holding people up since you were old enough to realise they needed it.</p><p>In African families, this role often falls on the firstborn — or the one who showed early signs of competence. You got good grades, so you became the family''s proof of possibility. You were level-headed in a crisis, so you became the family''s emotional manager. You did not break down, so everyone assumed you did not need to.</p><h2>But You Are Tired</h2><p>The exhaustion of constantly being needed is a specific kind of depletion. It is not just physical tiredness. It is the weariness of never being allowed to need. Of performing strength so consistently that you eventually forget you are performing.</p><p>Researchers call it "caretaker fatigue." Therapists call it "parentification" when it begins in childhood. We call it: <em>the thing no one in our family would name.</em></p><h2>You Are Allowed to Put It Down</h2><p>Strength is not the absence of need. It is the courage to acknowledge need while continuing forward. The strongest thing you can do for your family is to model what it looks like to take care of yourself — because they are watching, and they are learning.</p><p>You are allowed to say "I am not okay today." You are allowed to rest. You are allowed to stop carrying what was never yours to carry alone.</p>'),
  'a0000001-0000-0000-0000-000000000001',
  now() - interval '22 days',
  true,
  0,
  now() - interval '22 days'
),

(
  'b0000003-0000-0000-0000-000000000003',
  'Grief No One Talked About: When You Lose Someone and Are Expected to Move On',
  'grief-no-one-talked-about-losing-someone',
  'African funerals are loud, communal, and full of ceremony. But after everyone goes home, the mourner is often left alone with a grief that has no language and no timeline.',
  jsonb_build_object('html', '<p>The funeral is elaborate. The community shows up. There is food, music, prayers, and the warmth of a hundred people gathered in the name of someone loved.</p><p>And then, within days, everyone goes back to their lives. And you are expected to go back to yours.</p><p>Grief in many African cultures is treated as an event, not a process. The mourning period has a beginning and an end. After that, continuing to grieve is seen as a lack of faith, a failure to be strong, or an indulgence of sadness that could be better spent being productive.</p><h2>What Grief Actually Looks Like</h2><p>Grief does not follow a schedule. It comes in waves — sometimes years later, triggered by a song, a smell, a moment when you reach for your phone to call someone who is no longer there.</p><p>Unprocessed grief does not disappear. It shows up as anger, numbness, difficulty connecting with others, or a low-level sadness that has no obvious source. Many young Africans carry complicated grief from multiple losses — people, places, earlier versions of themselves — that they were never given space to mourn.</p><h2>You Are Allowed to Grieve</h2><p>There is no correct timeline. There is no strength in pretending. Grief is not a sign of weak faith or insufficient resilience — it is a sign that you loved deeply, and that love deserves to be honoured.</p><p>At Behind the Reels, we are committed to creating spaces where grief can be named, held, and moved through — without shame, and without rush.</p>'),
  'a0000001-0000-0000-0000-000000000001',
  now() - interval '15 days',
  false,
  0,
  now() - interval '15 days'
),

(
  'b0000004-0000-0000-0000-000000000004',
  'Social Media, Identity, and the Version of Yourself You Perform Online',
  'social-media-identity-version-of-yourself-online',
  'Every post is a choice about what to show and what to hide. But when the gap between your real life and your online life gets too wide, the performance becomes exhausting.',
  jsonb_build_object('html', '<p>You curate, therefore you are. Or at least, that is what social media seems to require.</p><p>For young Africans today, identity is constructed on two parallel tracks: the one being lived and the one being performed. The Instagram grid, the Twitter persona, the LinkedIn achievement feed — these are not lies, exactly. They are edited truths. Highlights. The version of yourself that you want the world to receive.</p><p>The problem begins when the gap between the two versions becomes too wide to sustain.</p><h2>The Performance Tax</h2><p>Maintaining a curated self online takes cognitive and emotional energy. Every post requires a calculation: Will this make me look weak? Will this invite questions I do not want to answer? Will this contradict the image I have been building?</p><p>Over time, the performance can become so habitual that you lose track of which self is real. You feel most like yourself offline, in private, when no one is watching — but you have invested so much in the online version that admitting the gap feels like a betrayal of your own brand.</p><h2>Reclaiming Authenticity</h2><p>We are not asking you to broadcast your pain on social media. Privacy is healthy. But there is a difference between privacy and performance — between choosing what not to share and feeling compelled to actively construct a false reality.</p><p>Authenticity does not require an audience. It is the private alignment between who you are and who you allow yourself to be, even when no one is watching.</p><p>Behind the Reels was built to create spaces where that alignment is possible — where you do not have to perform to belong.</p>'),
  'a0000001-0000-0000-0000-000000000001',
  now() - interval '8 days',
  false,
  0,
  now() - interval '8 days'
),

(
  'b0000005-0000-0000-0000-000000000005',
  'What It Means to Seek Help: Destigmatising Therapy for Young Africans',
  'what-it-means-to-seek-help-destigmatising-therapy',
  'Going to therapy in many African communities is still seen as a sign of madness, weakness, or failure. But the bravest thing you can do is decide that your mental health is worth fighting for.',
  jsonb_build_object('html', '<p>"You want to go and tell a stranger your business?" It is a sentence many Africans have heard — from family, from friends, from a voice in their own heads that has absorbed decades of cultural messaging about what it means to seek help.</p><p>In many African communities, therapy carries a stigma that is both practical and spiritual. Practical: you do not air your family''s private matters. Spiritual: if you have faith, you should not need a therapist. Emotional: seeking help is a sign that you are not strong enough to handle your problems.</p><h2>What Therapy Actually Is</h2><p>Therapy is not for people who are broken. It is for people who are human. It is a structured space to process emotion, understand patterns, develop coping strategies, and make intentional choices about your life — with the support of someone trained to help.</p><p>Athletes have coaches. Executives have mentors. Students have tutors. Your mind — the most complex and important instrument you have — deserves the same investment.</p><h2>You Are Not Betraying Your Family</h2><p>One of the most common barriers we hear at Behind the Reels is the fear that seeking help is a betrayal — of family values, of cultural identity, of God. But what if the opposite is true? What if getting the support you need makes you more present, more capable, more loving to the people around you?</p><p>Seeking help is not weakness. It is the most honest acknowledgement that you are worth more than survival. And in a continent where so many young people have been told to endure, choosing to heal is a radical, beautiful act of self-respect.</p>'),
  'a0000001-0000-0000-0000-000000000001',
  now() - interval '2 days',
  true,
  0,
  now() - interval '2 days'
)

ON CONFLICT (id) DO NOTHING;
