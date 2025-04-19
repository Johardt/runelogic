import { Suspense } from "react";
import CharacterFormWithData from "./formWithData";
import Loading from "./loading";

export default async function CreateCharacterPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Suspense fallback={<Loading />}>
        <CharacterFormWithData />
      </Suspense>
    </div>
  );
}
