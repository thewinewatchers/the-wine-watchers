import { Suspense } from "react";
import BoutiqueClient from "../BoutiqueClient";

export default function Primeurs2025Page() {
  return (
    <Suspense fallback={null}>
      <BoutiqueClient
        slug="primeurs-2025"
        categoryTitle="Primeurs 2025"
        appellations={[]}
      />
    </Suspense>
  );
}