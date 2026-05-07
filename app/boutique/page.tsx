 import BoutiqueClient from "./BoutiqueClient";
import { getWines } from "@/lib/wines";

export const dynamic = "force-dynamic";

export default async function BoutiquePage() {
  const wines = await getWines();

  return <BoutiqueClient wines={wines} />;
}