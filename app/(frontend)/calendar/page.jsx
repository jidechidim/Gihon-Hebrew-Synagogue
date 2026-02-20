import "./calendar.css";
import CalendarClient from "./CalendarClient";

export const revalidate = 3600;

const DEFAULT_GEONAMEID = "2352778";

async function getInitialCalendarItems() {
  try {
    const year = new Date().getFullYear();
    const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&geo=geoname&geonameid=${DEFAULT_GEONAMEID}&maj=on&min=on&mod=on&nx=on&ss=on&mf=on&c=on`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) return [];

    const data = await res.json();
    const items = data.items || [];

    return items.slice(0, 50).map((item) => ({
      id: item.uid || `${item.date}${item.title}`,
      title: item.title,
      date: item.date,
      hebrewDate: item.hebrew || null,
      category: item.category || null,
    }));
  } catch (err) {
    console.error("Initial calendar fetch error:", err);
    return [];
  }
}

export default async function CalendarPage() {
  const initialItems = await getInitialCalendarItems();

  return (
    <CalendarClient
      initialItems={initialItems}
      defaultLocation={DEFAULT_GEONAMEID}
    />
  );
}
