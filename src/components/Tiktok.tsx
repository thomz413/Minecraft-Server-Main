// TikTok icon
// todo Think later if its even a good idea to make encapsulate the socials icons with the primary color of the server isntead of their normal self
export default function TikTok({
	className = "w-10 h-10 mx-auto mb-1 group-hover:scale-110 transition-transform",
	...props
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden={false}
			role="img"
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>TikTok</title>
			{/* simplified filled musical-note style glyph that scales well */}
			<path
				fill="currentColor"
				d="M17.5 3.5v6.1a4.4 4.4 0 1 1-2.6-0.8V5.3h-2.8v7.9a6 6 0 1 0 5.4 6.6V3.5h0z"
			/>
		</svg>
	);
}
