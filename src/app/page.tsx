"use client";

import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { words } from "@/utils/words";

export default function Home() {
	const [currentLetter, setCurrentLetter] = useState(0);
	const [currentWord, setCurrentWord] = useState(0);
	const [cursorLeft, setCursorLeft] = useState(0);
	const [cursorTop, setCursorTop] = useState(4);
	const [visibleLine, setVisibleLine] = useState(0);
	const [randomWords, setRandomWords] = useState<string[]>([]);
	const [previousCursorLeft, setPreviousCursorLeft] = useState<number[]>([]);

	const wordsPerPage = 50;

	// Array to store letter refs
	const letterRefs = useRef<(HTMLParagraphElement | null)[][]>(
		words.map(() => [])
	);

	useEffect(() => {
		setRandomWords(words.sort(() => 0.5 - Math.random()).slice(0, wordsPerPage));
	}, []);
	
	useEffect(() => {

	}, )

	// Ref to store width of container so we know when the cursor should switch lines
	const containerRef = useRef<HTMLDivElement | null>(null);

	// On key press
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const key = event.key;
			const isWithinWord = currentLetter < words[currentWord]?.length;
			const isEndOfWord = currentLetter === words[currentWord]?.length;

			const moveCursorX = (offset: number) => {
				setCursorLeft((prev) => prev + offset);
			};

			const getLetterWidth = (wordIndex: number, letterIndex: number) =>
				letterRefs.current[wordIndex]?.[letterIndex]?.getBoundingClientRect().width || 0;

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
				else if (currentWord > 0 && cursorLeft > 0) {
					setCurrentWord((prev) => prev - 1);
					setCurrentLetter(randomWords[currentWord - 1].length);
					moveCursorX(-8);
				} else if (currentWord > 0) {
					setCurrentWord((prev) => prev - 1);
					setCurrentLetter(randomWords[currentWord - 1].length);
					moveCursorX(previousCursorLeft[previousCursorLeft.length - 1]);

					// Pop old cursor position so next line accesses the correct value
					setPreviousCursorLeft(prev => prev.slice(0,-1));
					
					const newCursorTop = cursorTop - 44;

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
			if (key === " " && isEndOfWord) {
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
					cursorLeft + nextWordWidth + 16  >=
					(containerRef.current?.getBoundingClientRect().width || 0)
				) {
					setCursorLeft(0);

					// Push old cursor position to array
					setPreviousCursorLeft([...previousCursorLeft, cursorLeft]);

					// Get the new cursor distance from the top of the container
					// Word height is 44 pixels with margin
					const newCursorTop = cursorTop + 44;

					// If the new calculated cursor position is going to the third line of text
					// move the text up
					if (newCursorTop >= 88) {
						setVisibleLine((prev) => prev + 1);
					} else {
						setCursorTop(newCursorTop);
					}
				} else {
					moveCursorX(8);
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
		<div className="w-full h-nav flex items-center justify-center">
			<div
				ref={containerRef}
				className="max-w-3xl w-full relative overflow-hidden max-h-[132px]"
			>
				<div
					className={clsx(
						"w-[3px] h-[35px] bg-accent rounded-full absolute transition-all duration-[25ms] ease-out",
						{ "animate-flash": cursorLeft === 0 && cursorTop === 4 }
					)}
					style={{ left: `${cursorLeft}px`, top: `${cursorTop}px` }}
				></div>
				<div
					className="flex flex-wrap w-full"
					style={{ transform: `translateY(-${visibleLine * 44}px)` }}
				>
					{randomWords.map((word, i) => (
						<div
							key={i}
							className="flex mx-[4px] my-[4px] text-3xl tracking-wider text-foreground/40"
						>
							{word.split("").map((letter, j) => (
								<p
									key={j}
									ref={(el) => {
										if (!letterRefs.current[i]) letterRefs.current[i] = [];
										letterRefs.current[i][j] = el;
									}}
									className="" // Default class, will be updated dynamically
								>
									{letter}
								</p>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
