import { useEffect, useState } from "react";

export function useNavbarVisibility(
	scrollY: number,
	heroRef: React.RefObject<HTMLElement | null>,
) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight;
		setShow(scrollY > Math.max(200, heroHeight - 120));
	}, [scrollY]);

	return show;
}
