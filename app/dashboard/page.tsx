import Form from "@/components/Form";
import GridCard from "@/components/GridCard";
import Nav from "@/components/Nav";
import path from "path";
import fs from "fs/promises";

const _0x4f2d = async () => {
	const filePath = path.join(
		process.cwd(),
		"public",
		"template",
		"credit.json",
	);
	const fileContent = await fs.readFile(filePath, "utf8");
	const data = JSON.parse(fileContent);
	return Buffer.from(data._0xe[1], "base64").toString();
};

export default async function Home() {
	const credit = await _0x4f2d();

	return (
		<div className="scrollbar-hide max-w-full overflow-y-auto h-screen">
			<div className="relative left-0">
				<Nav />
			</div>
			<div className="flex flex-col md:flex-row gap-4 md:gap-14 lg:gap-96 p-4 mt-16 lg:-mt-5 lg:-ml-12 mx-5">
				<div className="mb-8">
					<Form />
				</div>

				<div className="mt-2 lg:mt-44 xl:mt-64 lg:mr-10 ">
					<GridCard />
				</div>
			</div>

			<div className="fixed bottom-4 w-full text-center text-base md:text-lg font-medium text-white hover:text-gray-800 transition-colors">
				{credit}
			</div>
		</div>
	);
}
