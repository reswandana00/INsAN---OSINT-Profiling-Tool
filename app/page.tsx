import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import DirDelete from "./api/DirDelete";

export default async function Home() {
  await DirDelete();
  return (
    <div className="">
      <div>
        <Nav />
      </div>

      <main>
        <div>
          <Hero />
        </div>
      </main>
    </div>
  );
}
