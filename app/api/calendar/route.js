import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = searchParams.get("year") || new Date().getFullYear();
    const fallbackGeonameid = "2332459";
    const geonameid = searchParams.get("geonameid") || fallbackGeonameid;
    const month = searchParams.get("month");
    const parshaOnly = searchParams.get("parsha") === "true";

    const buildHebcalUrl = (locationGeonameid) => {
      let url = `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&geo=geoname&geonameid=${locationGeonameid}&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on`;

      if (month) url += `&month=${month}`;

      return url;
    };

    let res = await fetch(buildHebcalUrl(geonameid), { next: { revalidate: 3600 } });

    if (!res.ok && geonameid !== fallbackGeonameid) {
      res = await fetch(buildHebcalUrl(fallbackGeonameid), { next: { revalidate: 3600 } });
    }

    if (!res.ok) throw new Error(`Hebcal fetch failed with status ${res.status}`);

    const data = await res.json();
    let items = data.items || [];

    if (parshaOnly) {
      items = items.filter((item) => item.category === "parashat");
    }

    items = items.slice(0, 50).map((item) => ({
      id: item.uid || item.date + item.title,
      title: item.title,
      date: item.date,
      hebrewDate: item.hebrew || null,
      category: item.category || null,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Unable to load calendar." },
      { status: 500 }
    );
  }
}
