"use client";

import clsx from "clsx";
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { words } from "@/utils/words";
import { wordsPerPage } from "@/app/page";

export default function Home({
	setTimer,
	setKeyData,
}: {
	setTimer: Dispatch<
		SetStateAction<{
			start: number;
			end: number;
		}>
	>;
	setKeyData: Dispatch<SetStateAction<any[]>>;
}) {
	const charHeight = 48;
	const wordSpacing = 6;

	const [currentLetter, setCurrentLetter] = useState(0);
	const [currentWord, setCurrentWord] = useState(0);
	const [cursorLeft, setCursorLeft] = useState(wordSpacing - 4);
	const [cursorTop, setCursorTop] = useState(4);
	const [visibleLine, setVisibleLine] = useState(0);
	const [randomWords, setRandomWords] = useState<string[]>([]);
	const [isJiggling, setIsJiggling] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [previousCursorLeft, setPreviousCursorLeft] = useState<number[]>([]);

	const jiggleTimeout = useRef<NodeJS.Timeout | null>(null);

	// Array to store letter refs
	const letterRefs = useRef<(HTMLParagraphElement | null)[][]>(
		words.map(() => [])
	);

	useEffect(() => {
		setRandomWords(
			words.sort(() => 0.5 - Math.random()).slice(0, wordsPerPage)
		);
	}, []);

	useEffect(() => {
		if (
			currentWord + 1 === wordsPerPage &&
			currentLetter === randomWords[currentWord].length
		) {
			const currentDate = new Date();
			setTimer((prev) => ({ start: prev.start, end: currentDate.getTime() }));
			setIsRunning(false);
			containerRef.current?.classList.add("opacity-0");
		}
	}, [currentWord, currentLetter]);

	// Ref to store width of container so we know when the cursor should switch lines
	const containerRef = useRef<HTMLDivElement | null>(null);

	// On key press
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const key = event.key;
			const isWithinWord = currentLetter < words[currentWord]?.length;
			const isEndOfWord = currentLetter === words[currentWord]?.length;

			if (!isRunning) {
				setIsRunning(true); // Start timer on first keypress
				const currentDate = new Date();
				setTimer({ start: currentDate.getTime(), end: 0 });
			}

			const moveCursorX = (offset: number) => {
				setCursorLeft((prev) => prev + offset);
			};

			const getLetterWidth = (wordIndex: number, letterIndex: number) =>
				letterRefs.current[wordIndex]?.[letterIndex]?.getBoundingClientRect()
					.width || 0;

			const insertKeyData = (
				key: string,
				correct: number,
				incorrect: number
			) => {
				setKeyData((prevKeyData) => {
					const existingEntry = prevKeyData.find((entry) => entry.key === key);

					if (existingEntry) {
						// Update existing entry
						return prevKeyData.map((entry) =>
							entry.key === key
								? {
										...entry,
										correct: entry.correct + correct,
										incorrect: entry.incorrect + incorrect,
								  }
								: entry
						);
					} else {
						// Add new entry
						return [...prevKeyData, { key, correct, incorrect }];
					}
				});
			};

			// Handle Backspace
			if (key === "Backspace") {
				// Not on first letter of word
				if (currentLetter > 0) {
					setCurrentLetter((prev) => prev - 1);
					moveCursorX(-getLetterWidth(currentWord, currentLetter - 1));

					// Reset class for the letter when backspacing
					if (letterRefs.current[currentWord][currentLetter - 1]) {
						letterRefs.current[currentWord][
							currentLetter - 1
						]!.classList.remove("text-foreground", "text-error");
					}
				}
				// On first letter of word and previous word contains error
				else if (currentWord > 0 && cursorLeft > wordSpacing - 4) {
					setCurrentWord((prev) => prev - 1);
					setCurrentLetter(randomWords[currentWord - 1].length);
					moveCursorX(-wordSpacing * 2);
				} else if (currentWord > wordSpacing - 4) {
					setCurrentWord((prev) => prev - 1);
					setCurrentLetter(randomWords[currentWord - 1].length);
					setCursorLeft(previousCursorLeft[previousCursorLeft.length - 1]);

					// Pop old cursor position so next line accesses the correct value
					setPreviousCursorLeft((prev) => prev.slice(0, -1));

					const newCursorTop = cursorTop - charHeight;

					// If the new calculated cusor position is going to the third line of text
					// move the text up
					if (newCursorTop < 0) {
						setVisibleLine((prev) => prev - 1);
					} else {
						setCursorTop(newCursorTop);
					}
				}
				return;
			}

			// Typing within the word
			if (isWithinWord) {
				const isCorrect = key === words[currentWord][currentLetter];

				if (isCorrect) {
					insertKeyData(key, 1, 0);
				} else {
					insertKeyData(words[currentWord][currentLetter], 0, 1);
				}

				// Add the correct or incorrect class to the letter element
				if (letterRefs.current[currentWord][currentLetter]) {
					letterRefs.current[currentWord][currentLetter]!.classList.add(
						isCorrect ? "text-foreground" : "text-error"
					);
				}

				moveCursorX(getLetterWidth(currentWord, currentLetter));
				setCurrentLetter((prev) => prev + 1);
				return;
			}

			// Handle Space (move to the next word)
			if (key === " " && isEndOfWord && currentWord + 1 < wordsPerPage) {
				setCurrentWord((prev) => prev + 1);
				setCurrentLetter(0);

				const nextWordWidth =
					letterRefs.current[currentWord + 1]?.reduce(
						(acc, letter) => acc + (letter?.getBoundingClientRect().width || 0),
						0
					) || 0;

				// Check if the width of the next word plus the current cursor position
				// will overflow the edge of the container, if so, move to the next line.
				if (
					cursorLeft + (nextWordWidth + wordSpacing * 2) + wordSpacing + 4 >=
					(containerRef.current?.getBoundingClientRect().width || 0)
				) {
					setCursorLeft(wordSpacing - 4);

					// Push old cursor position to array
					setPreviousCursorLeft([...previousCursorLeft, cursorLeft]);

					// Get the new cursor distance from the top of the container
					// Word height is charHeight pixels with margin
					const newCursorTop = cursorTop + charHeight;

					// If the new calculated cursor position is going to the third line of text
					// move the text up
					if (newCursorTop >= charHeight * 2) {
						setVisibleLine((prev) => prev + 1);
					} else {
						setCursorTop(newCursorTop);
					}
				} else {
					moveCursorX(wordSpacing * 2);
				}
				return;
			} else if (
				isEndOfWord &&
				key !== " " &&
				key.length === 1 &&
				currentWord + 1 < wordsPerPage
			) {
				if (!isJiggling) {
					setIsJiggling(true);

					if (jiggleTimeout.current) clearTimeout(jiggleTimeout.current);

					jiggleTimeout.current = setTimeout(() => setIsJiggling(false), 50);
				}

				return;
			}
		},
		[currentLetter, currentWord]
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div
			ref={containerRef}
			className="w-full relative overflow-hidden transition-opacity duration-300"
			style={{ maxHeight: charHeight * 3 }}
		>
			{/* CURSOR ------------------------------*/}
			<div
				className={clsx(
					"w-[3px] bg-accent rounded-full absolute transition-all duration-75 ease-out",
					{
						"animate-flash": cursorLeft === wordSpacing - 4 && cursorTop === 4,
					},
					{ "animate-jiggle": isJiggling }
				)}
				style={{
					height: charHeight - 8,
					left: `${cursorLeft}px`,
					top: `${cursorTop}px`,
				}}
			></div>
			{/* CURSOR END --------------------------*/}
			<div
				className="flex flex-wrap w-full"
				style={{ transform: `translateY(-${visibleLine * charHeight}px)` }}
			>
				{randomWords.map((word, i) => (
					<div
						key={i}
						className="flex my-[4px] text-4xl tracking-wider text-foreground/30"
						style={{ marginInline: wordSpacing }}
					>
						{word.split("").map((letter, j) => (
							<p
								key={j}
								ref={(el) => {
									if (!letterRefs.current[i]) letterRefs.current[i] = [];
									letterRefs.current[i][j] = el;
								}}
								className=""
							>
								{letter}
							</p>
						))}
					</div>
				))}
			</div>
		</div>
	);
}
