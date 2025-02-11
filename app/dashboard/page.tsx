import Form from "@/components/Form";
import GridCard from "@/components/GridCard";
import Nav from "@/components/Nav";
import FlushButton from "@/components/ui/flush-button";

export default function Home() {
  return (
    <div className="scrollbar-hide max-w-full overflow-y-auto h-screen">
      <div className="relative">
        <Nav />
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-14 lg:gap-96 p-4 mt-16 lg:-mt-5 lg:-ml-12 mx-5">
        <div className="mb-8">
          <Form />
        </div>

        <div className="mt-2 lg:mt-44 xl:mt-64 lg:mr-10">
          <GridCard />
        </div>
      </div>
    </div>
  );
}
