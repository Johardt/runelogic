import { getUser } from "@/utils/supabase/server";

export default async function CharactersPage() {
  const { error, user } = await getUser();
  if (error || !user) {
    console.log(error);
    return <div>Something went wrong.</div>;
  }

  return <div></div>;
}
