"use client";

import Test from "@/components/Test";
import TestResults from "@/components/TestResults";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const wordsPerPage = 10;

export default function Home() {
	const [timer, setTimer] = useState<{ start: number; end: number }>({
		start: 0,
		end: 0,
	});
	const [testComplete, setTestComplete] = useState(false);
	const [wpm, setWpm] = useState(0);
	const [keyData, setKeyData] = useState<any[]>([])

	useEffect(() => {
		if (timer.end) {
			// This will run only after `timer.end` has been updated
			const timeElapsedInMinutes = ((timer.end - timer.start) * 0.001) / 60;

			if (timeElapsedInMinutes <= 0) {
				console.log("WPM Calculation Error: Time elapsed too short");
				return;
			}

			setWpm(wordsPerPage / timeElapsedInMinutes);

			setTimeout(() => {
				setTestComplete(true);
			}, 300);
		}
	}, [timer.end]);

	return (
		<div className="w-full h-nav flex items-center justify-center">
			<div className="max-w-5xl w-full">
				{!testComplete && <Test setTimer={setTimer} setKeyData={setKeyData} keyData={keyData}/>}
				<div
					className={clsx(
						"transition-opacity duration-300 w-full",
						testComplete ? "opacity-100" : "opacity-0"
					)}
				>
					{testComplete && (
						<TestResults wpm={wpm} keyData={keyData}/>
					)}
				</div>
			</div>
		</div>
	);
}
