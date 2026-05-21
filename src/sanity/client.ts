import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, useCdn } from "./env";

export function getSanityClient() {
  if (!projectId) {
    return null;
  }

  return createClient({
    apiVersion,
    dataset,
    projectId,
    useCdn
  });
}
