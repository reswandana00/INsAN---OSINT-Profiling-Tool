import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Link,
	Button,
} from "@heroui/react";

export const AcmeLogo = () => {
	return <img src="/INsAN.svg" alt="INsAN Logo" width={36} height={36} />;
};

export default function App() {
	return (
		<Navbar isBordered className="">
			<NavbarBrand as={Link} href="/" className="">
				<AcmeLogo />
				<p className="ml-2 font-bold text-inherit">INsAN</p>
			</NavbarBrand>
		</Navbar>
	);
}
