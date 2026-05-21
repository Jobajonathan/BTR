import { author } from "./types/author";
import { category } from "./types/category";
import { dialogue } from "./types/dialogue";
import { outreach } from "./types/outreach";
import { resource } from "./types/resource";
import { siteSettings } from "./types/siteSettings";
import { story } from "./types/story";
import { teamMember } from "./types/teamMember";

export const schemaTypes = [
  siteSettings,
  story,
  author,
  category,
  dialogue,
  outreach,
  resource,
  teamMember
];
