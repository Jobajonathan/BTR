import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { SectionIntro } from "@/components/section-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { fallbackResources, fallbackStories } from "@/lib/content";
import { getSanityClient } from "@/sanity/client";
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

async function getHomepageData(): Promise<HomepageData> {
  const client = getSanityClient();

  if (!client) {
    return {};
  }

  return client.fetch<HomepageData>(homepageQuery, {}, { next: { revalidate: 60 } });
}

export default async function Home() {
  const data = await getHomepageData();
  const settings = data.settings;
  const stories: StoryCard[] = data.featuredStories?.length
    ? data.featuredStories
    : fallbackStories.slice(0, 3);
  const resources: ResourceCard[] = data.resources?.length
    ? data.resources
    : fallbackResources;
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
      <SiteHeader />

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
            <ContentCard
              accent={(index % 3) + 1}
              excerpt={story.excerpt}
              href={story.slug?.current ? `/stories/${story.slug.current}` : "/stories"}
              key={story._id}
              tag={story.category || "Story"}
              title={story.title}
            />
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
              <p>{resource.excerpt || "Guide - 5 min read"}</p>
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

      <SiteFooter />
    </main>
  );
}
