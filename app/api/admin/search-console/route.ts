import { NextResponse } from "next/server";

import { querySearchConsole } from "@/lib/googleSearchConsole";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchConsoleRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(days: number, offsetDays = 0) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 3 - offsetDays);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

function normalizeRows(rows: SearchConsoleRow[] | null | undefined) {
  return (rows || []).map((row) => ({
    keys: row.keys || [],
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    ctr: Number(row.ctr || 0),
    position: Number(row.position || 0),
  }));
}

function summarizeRows(rows: ReturnType<typeof normalizeRows>) {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);

  const weightedPosition =
    impressions > 0
      ? rows.reduce(
          (sum, row) => sum + row.position * row.impressions,
          0
        ) / impressions
      : 0;

  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: weightedPosition,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedDays = Number(searchParams.get("days") || 28);
    const days = [7, 28, 90].includes(requestedDays) ? requestedDays : 28;

    const currentRange = getDateRange(days);
    const previousRange = getDateRange(days, days);

    const [
      currentSummaryResponse,
      previousSummaryResponse,
      dailyResponse,
      pagesResponse,
      queriesResponse,
    ] = await Promise.all([
      querySearchConsole({
        ...currentRange,
        rowLimit: 1,
      }),
      querySearchConsole({
        ...previousRange,
        rowLimit: 1,
      }),
      querySearchConsole({
        ...currentRange,
        dimensions: ["date"],
        rowLimit: 500,
      }),
      querySearchConsole({
        ...currentRange,
        dimensions: ["page"],
        rowLimit: 250,
        aggregationType: "byPage",
      }),
      querySearchConsole({
        ...currentRange,
        dimensions: ["query"],
        rowLimit: 250,
      }),
    ]);

    const currentSummaryRows = normalizeRows(
      currentSummaryResponse.rows as SearchConsoleRow[] | undefined
    );
    const previousSummaryRows = normalizeRows(
      previousSummaryResponse.rows as SearchConsoleRow[] | undefined
    );
    const dailyRows = normalizeRows(
      dailyResponse.rows as SearchConsoleRow[] | undefined
    );
    const pageRows = normalizeRows(
      pagesResponse.rows as SearchConsoleRow[] | undefined
    );
    const queryRows = normalizeRows(
      queriesResponse.rows as SearchConsoleRow[] | undefined
    );

    const currentSummary =
      currentSummaryRows.length > 0
        ? currentSummaryRows[0]
        : summarizeRows(pageRows);

    const previousSummary =
      previousSummaryRows.length > 0
        ? previousSummaryRows[0]
        : summarizeRows([]);

    const pages = pageRows.map((row) => ({
      page: row.keys[0] || "",
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));

    const queries = queryRows.map((row) => ({
      query: row.keys[0] || "",
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));

    const opportunities = queries
      .filter(
        (row) =>
          row.impressions >= 10 &&
          row.position >= 8 &&
          row.position <= 25
      )
      .sort((a, b) => {
        if (b.impressions !== a.impressions) {
          return b.impressions - a.impressions;
        }

        return a.position - b.position;
      })
      .slice(0, 50);

    const lowCtrOpportunities = queries
      .filter(
        (row) =>
          row.impressions >= 20 &&
          row.ctr < 0.03 &&
          row.position <= 15
      )
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 50);

    return NextResponse.json({
      success: true,
      days,
      ranges: {
        current: currentRange,
        previous: previousRange,
      },
      summary: {
        current: currentSummary,
        previous: previousSummary,
      },
      daily: dailyRows.map((row) => ({
        date: row.keys[0] || "",
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      })),
      pages,
      queries,
      opportunities,
      lowCtrOpportunities,
    });
  } catch (error) {
    console.error("Erreur Search Console :", error);

    return NextResponse.json(
      {
        error: "Impossible de charger les données Search Console.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}