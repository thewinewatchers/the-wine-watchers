import "server-only";

import { google, searchconsole_v1 } from "googleapis";

const SEARCH_CONSOLE_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variable d’environnement manquante : ${name}`);
  }

  return value;
}

function getPrivateKey() {
  return getRequiredEnvironmentVariable(
    "GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY"
  ).replace(/\\n/g, "\n");
}

export function getSearchConsoleSiteUrl() {
  return getRequiredEnvironmentVariable(
    "GOOGLE_SEARCH_CONSOLE_SITE_URL"
  );
}

export function getSearchConsoleClient() {
  const clientEmail = getRequiredEnvironmentVariable(
    "GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL"
  );

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: getPrivateKey(),
    scopes: [SEARCH_CONSOLE_SCOPE],
  });

  return google.searchconsole({
    version: "v1",
    auth,
  });
}

export type SearchConsoleQueryOptions = {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
  startRow?: number;
  type?: "web" | "image" | "video" | "news" | "discover" | "googleNews";
  aggregationType?: "auto" | "byPage" | "byProperty";
  dimensionFilterGroups?: searchconsole_v1.Schema$ApiDimensionFilterGroup[];
};

export async function querySearchConsole(
  options: SearchConsoleQueryOptions
) {
  const searchConsole = getSearchConsoleClient();
  const siteUrl = getSearchConsoleSiteUrl();

  const response = await searchConsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions || [],
      rowLimit: options.rowLimit ?? 1000,
      startRow: options.startRow ?? 0,
      type: options.type ?? "web",
      aggregationType: options.aggregationType ?? "auto",
      dimensionFilterGroups: options.dimensionFilterGroups,
      dataState: "final",
    },
  });

  return response.data;
}