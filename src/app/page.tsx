import Link from "next/link";
import { client } from "@/sanity/client";
import { homepageQuery } from "@/sanity/queries";

type StoryCard = {
  _id: string;
  title: string;
  excerpt?: string;
  category?: string;
  slug?: { current: string };
};

type ResourceCard = {
  _id: string;
  title: string;
  excerpt?: string;
  slug?: { current: string };
};

type Dialogue = {
  _id: string;
  title: string;
  summary?: string;
};

type HomepageData = {
  settings?: {
    heroHeadline?: string;
    heroCopy?: string;
    impactStats?: Array<{ value: string; label: string }>;
  };
  featuredStories?: StoryCard[];
  resources?: ResourceCard[];
  dialogues?: Dialogue[];
};

const fallbackStories: StoryCard[] = [
  {
    _id: "family",
    title: "Why emotional numbing feels normal in many African homes",
    excerpt:
      "A gentle look at silence, survival, and learning to feel again without shame.",
    category: "Family & Silence"
  },
  {
    _id: "burnout",
    title: "Burnout is not laziness",
    excerpt:
      "For students, creators, and young professionals who are tired of performing strength.",
    category: "School & Work"
  },
  {
    _id: "men",
    title: "Men need language for pain too",
    excerpt:
      "Honest reflections on masculinity, friendship, faith, and asking for help.",
    category: "Men & Mental Health"
  }
];

const fallbackResources: ResourceCard[] = [
  { _id: "friend", title: "How to support a friend who is struggling" },
  { _id: "parents", title: "Talking to African parents about mental health" },
  { _id: "sadness", title: "When sadness becomes more than sadness" },
  { _id: "shame", title: "Finding help without shame" }
];

async function getHomepageData(): Promise<HomepageData> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return {};
  }

  return client.fetch<HomepageData>(homepageQuery, {}, { next: { revalidate: 60 } });
}

export default async function Home() {
  const data = await getHomepageData();
  const settings = data.settings;
  const stories = data.featuredStories?.length
    ? data.featuredStories
    : fallbackStories;
  const resources = data.resources?.length ? data.resources : fallbackResources;
  const featuredDialogue = data.dialogues?.[0];
  const stats = settings?.impactStats?.length
    ? settings.impactStats
    : [
        {
          value: "1M+",
          label: "people reached through stories and conversations"
        },
        {
          value: "3",
          label: "core pillars: storytelling, dialogues, outreaches"
        },
        {
          value: "Africa",
          label: "centered voice, context, and community care"
        }
      ];

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/">
          <span className="brand-mark" />
          <span>Behind the Reels</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/stories">Stories</Link>
          <Link href="/dialogues">Dialogues</Link>
          <Link href="/outreach">Outreach</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link className="button primary" href="/join">
          Join the Community
        </Link>
      </header>

      <section className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">Mental health for young Africans</p>
          <h1>{settings?.heroHeadline || "Behind every reel is a real story."}</h1>
          <p className="hero-lede">
            {settings?.heroCopy ||
              "A fast-growing mental health community helping young Africans speak honestly about pressure, identity, family, anxiety, healing, and hope."}
          </p>
          <div className="actions">
            <Link className="button primary" href="/stories">
              Read Stories
            </Link>
            <Link className="button secondary" href="/submit">
              Submit Your Story
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="story-panel family-panel">
            <span>Family & Silence</span>
            <strong>The things we never said at home</strong>
            <p>Stories that make hidden emotions easier to name.</p>
          </div>
          <div className="story-panel dialogue-panel">
            <span>Dialogues</span>
            <strong>Conversations we were never taught to have</strong>
          </div>
          <div className="portrait-orb" />
        </div>
      </section>

      <section className="impact-strip">
        <h2>A community moving mental health conversations from timelines into real life.</h2>
        {stats.map((stat) => (
          <div className="stat" key={`${stat.value}-${stat.label}`}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section stories-section">
        <SectionIntro
          kicker="Stories"
          title="Read what young Africans are carrying."
          body="Personal essays, reflections, and educational articles that make invisible emotions easier to understand."
        />
        <div className="card-grid">
          {stories.map((story, index) => (
            <article className="story-card" key={story._id}>
              <div className={`card-image accent-${index + 1}`} />
              <span className="tag">{story.category || "Story"}</span>
              <h3>{story.title}</h3>
              <p>{story.excerpt}</p>
              <Link href={story.slug?.current ? `/stories/${story.slug.current}` : "/stories"}>
                Read the story
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="dialogue-section section dark-section">
        <SectionIntro
          kicker="Dialogues"
          title="Conversations we were never taught to have."
          body="Live sessions, interviews, panels, and community questions that turn shared posts into shared understanding."
          dark
        />
        <article className="dialogue-card">
          <span className="tag">Next conversation</span>
          <h3>
            {featuredDialogue?.title ||
              "Pressure, parents, and the version of yourself you perform online"}
          </h3>
          <p>
            {featuredDialogue?.summary ||
              "A community dialogue on expectation, identity, and choosing honesty when everyone expects you to be fine."}
          </p>
          <Link className="button primary" href="/dialogues">
            View Dialogues
          </Link>
        </article>
      </section>

      <section className="section outreach-section">
        <div className="outreach-collage" aria-hidden="true">
          <div>Campus dialogue</div>
          <div>Community circle</div>
          <div>Partner outreach</div>
        </div>
        <div>
          <SectionIntro
            kicker="Outreach"
            title="Mental health work that leaves the screen."
            body="Show schools, communities, partners, and supporters what the movement is doing offline through recaps, galleries, and impact reports."
          />
          <Link className="button primary" href="/outreach">
            Explore Impact
          </Link>
        </div>
      </section>

      <section className="section resources-section">
        <SectionIntro
          kicker="Resources"
          title="Practical guides for the moments that feel heavy."
          body="Culturally sensitive mental health resources written for young Africans and the people who care about them."
        />
        <div className="resource-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource._id}>
              <h3>{resource.title}</h3>
              <p>{resource.excerpt || "Guide · 5 min read"}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="community-cta">
        <h2>There is a story behind what you survived.</h2>
        <p>
          Join the community, share your story, or partner with Behind the Reels
          to make mental health conversations easier to start.
        </p>
        <div className="actions">
          <Link className="button light" href="/join">
            Join the Community
          </Link>
          <Link className="button light" href="/partner">
            Partner With Us
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <strong>Behind the Reels</strong>
          <p>Mental health storytelling, dialogues, and outreaches for young Africans.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/stories">Stories</Link>
          <Link href="/dialogues">Dialogues</Link>
          <Link href="/outreach">Outreach</Link>
          <Link href="/resources">Resources</Link>
        </nav>
        <nav aria-label="Community links">
          <Link href="/submit">Submit your story</Link>
          <Link href="/partner">Partner with us</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="https://www.instagram.com/behindthereels.co/">Instagram</Link>
        </nav>
      </footer>
    </main>
  );
}

function SectionIntro({
  kicker,
  title,
  body,
  dark = false
}: {
  kicker: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <div className={dark ? "section-intro dark" : "section-intro"}>
      <p>{kicker}</p>
      <h2>{title}</h2>
      <span>{body}</span>
    </div>
  );
}
