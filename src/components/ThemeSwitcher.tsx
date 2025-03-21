"use client";

import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
	const [theme, setTheme] = useState(() => {
		return typeof window !== "undefined" &&
			localStorage.getItem("theme") === "dark"
			? "dark"
			: "light";
	});

	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.style.setProperty("--background", "#111111");
			document.documentElement.style.setProperty("--foreground", "#ededed");
		} else {
			document.documentElement.style.setProperty("--background", "#ffffff");
			document.documentElement.style.setProperty("--foreground", "#171717");
		}
		localStorage.setItem("theme", theme);
	}, [theme]);

	const handleTheme = () => {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	};

	return (
		<button
			className="cursor-pointer"
			onClick={handleTheme}
		>
			Toggle Theme
		</button>
	);
};

export default ThemeSwitcher;
