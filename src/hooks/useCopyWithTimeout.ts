import { useRef, useState, useEffect } from "react";

export function useCopyWithTimeout(timeout = 2000) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const copy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);

			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = window.setTimeout(() => {
				setCopied(false);
			}, timeout);
		} catch (e) {
			console.warn("Clipboard write failed", e);
		}
	};

	return { copied, copy };
}
