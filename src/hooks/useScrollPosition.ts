import { useEffect, useRef, useState } from "react";

export function useScrollPosition() {
	const [scrollY, setScrollY] = useState(0);
	const lastScroll = useRef(0);
	const ticking = useRef(false);

	useEffect(() => {
		const handler = () => {
			lastScroll.current = window.scrollY || window.pageYOffset;

			if (!ticking.current) {
				window.requestAnimationFrame(() => {
					setScrollY(lastScroll.current);
					ticking.current = false;
				});
				ticking.current = true;
			}
		};

		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return scrollY;
}
