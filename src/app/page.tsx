"use client";

import Test from "@/components/Test";
import TestResults from "@/components/TestResults";
import WordsPerPageSwitcher from "@/components/WordsPerPageSwitcher";
import { ContextProvider } from "@/context/WordsPerPageContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

export type KeyData = { key: string; corrcect: number; incorrect: number }[];

export default function Home() {
	const [timer, setTimer] = useState<{ start: number; end: number }>({
		start: 0,
		end: 0,
	});
	const [testComplete, setTestComplete] = useState(false);
	const [timeElapsedInMin, setTimeElapsedInMin] = useState(0);
	const [keyData, setKeyData] = useState<KeyData>([]);

	useEffect(() => {
		if (timer.end) {
			// This will run only after `timer.end` has been updated
			setTimeElapsedInMin(((timer.end - timer.start) * 0.001) / 60);

			setTimeout(() => {
				setTestComplete(true);
			}, 300);
		}
	}, [timer.end]);

	return (
		<div className="w-full h-[calc(100vh_-_var(--nav-height))] flex items-center justify-center">
			<div className="max-w-5xl w-full pb-48">
				<ContextProvider>
				{!testComplete && (
					<div className="flex flex-col gap-24">
						<WordsPerPageSwitcher />
						<Test
							setTimer={setTimer}
							setKeyData={setKeyData}
						/>
					</div>
				)}
				<div
					className={clsx(
						"transition-opacity duration-300 w-full",
						testComplete ? "opacity-100" : "opacity-0"
					)}
				>
					{testComplete && (
						<TestResults
							timeElapsed={timeElapsedInMin}
							keyData={keyData}
						/>
					)}
				</div>
				</ContextProvider>
			</div>
		</div>
	);
}
