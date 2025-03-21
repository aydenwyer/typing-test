"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

const words: string[] = [
	"apple",
	"banana",
	"cherry",
	"dog",
	"elephant",
	"forest",
	"grape",
	"house",
	"island",
	"jungle",
	"kangaroo",
	"lemon",
	"mountain",
	"notebook",
	"ocean",
	"penguin",
	"quartz",
	"rainbow",
	"sunshine",
	"tiger",
	"umbrella",
	"volcano",
	"waterfall",
	"xylophone",
	"yesterday",
	"zebra",
	"adventure",
	"butterfly",
	"coconut",
	"dolphin",
	"enigma",
	"firefly",
	"galaxy",
	"horizon",
	"invisible",
	"jigsaw",
	"kaleidoscope",
	"lighthouse",
	"mystery",
	"nebula",
	"orchestra",
	"paradox",
	"quicksand",
	"revolution",
	"serendipity",
	"tornado",
	"universe",
	"voyage",
	"whisper",
	"xenon",
	"yearning",
	"zephyr",
	"alchemy",
	"breeze",
	"cascade",
	"destiny",
	"echo",
	"fable",
	"glacier",
	"harmony",
	"illusion",
	"journey",
	"knight",
	"labyrinth",
	"melody",
	"nirvana",
	"obsidian",
	"prism",
	"quiver",
	"resonance",
	"symphony",
	"twilight",
	"utopia",
	"vortex",
	"wander",
	"wilderness",
	"zenith",
	"astronomy",
	"ballad",
	"constellation",
	"daydream",
	"epiphany",
	"flourish",
	"glisten",
	"horizon",
	"infinity",
	"jubilee",
	"kindred",
	"lantern",
	"miracle",
	"nostalgia",
	"overture",
	"phantom",
	"quintessential",
	"radiance",
	"silhouette",
	"tranquility",
	"unravel",
	"vivid",
	"whimsical",
	"yonder",
	"zen",
];

export default function Home() {
	const [currentLetter, setCurrentLetter] = useState(0);
	const [currentWord, setCurrentWord] = useState(0);
	const [correctIds, setCorrectIds] = useState<number[][]>(words.map(() => []));
	const [cursorLeft, setCursorLeft] = useState(0);
	const [cursorTop, setCursorTop] = useState(4);
	const [visibleLine, setVisibleLine] = useState(0);
	const [randomWords, setRandomWords] = useState<string[]>([]);

	// Array to store letter widths to calculate cursor position
	const letterRefs = useRef<(HTMLParagraphElement | null)[][]>(
		words.map(() => [])
	);

	// Ref to store width of container so we know when the cursor should switch lines
	const containerRef = useRef<HTMLDivElement | null>(null);

	// On key press
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const key = event.key;
			const isWithinWord = currentLetter < words[currentWord]?.length;
			const isEndOfWord = currentLetter === words[currentWord]?.length;

			const moveCursor = (offset: number) => {
				setCursorLeft((prev) => prev + offset);
			};

			const updateCorrectIds = (value: number) => {
				setCorrectIds((prev) => {
					const newCorrectIds = [...prev];
					newCorrectIds[currentWord] = [...newCorrectIds[currentWord], value];
					return newCorrectIds;
				});
			};

			const getLetterWidth = (wordIndex: number, letterIndex: number) =>
				letterRefs.current[wordIndex]?.[letterIndex]?.offsetWidth || 0;

			// Handle Backspace
			if (key === "Backspace") {
				// Not on first letter of word
				if (currentLetter > 0) {
					setCurrentLetter((prev) => prev - 1);
					moveCursor(-getLetterWidth(currentWord, currentLetter - 1));

					setCorrectIds((prev) => {
						const newCorrectIds = [...prev];
						newCorrectIds[currentWord] = newCorrectIds[currentWord].slice(
							0,
							-1
						);
						return newCorrectIds;
					});
				}
				// On first letter of word and previous word contains error
				else if (currentWord > 0 && correctIds[currentWord - 1].includes(0)) {
					setCurrentWord((prev) => prev - 1);
					setCurrentLetter(randomWords[currentWord - 1].length);
					moveCursor(-8);
				}
				return;
			}

			// Typing within the word
			if (isWithinWord) {
				// Correct key click
				if (key === words[currentWord][currentLetter]) {
					updateCorrectIds(1);
				} else {
					updateCorrectIds(0);
				}

				moveCursor(getLetterWidth(currentWord, currentLetter));
				setCurrentLetter((prev) => prev + 1);
				return;
			}

			// Handle Space (move to the next word)
			if (key === " " && isEndOfWord) {
				setCurrentWord((prev) => prev + 1);
				setCurrentLetter(0);

				const nextWordWidth =
					letterRefs.current[currentWord + 1]?.reduce(
						(acc, letter) => acc + (letter?.offsetWidth || 0),
						0
					) || 0;

				// Check if the width of the next word plus the current cursor position
				// will overflow the edge of the container, if so, move to the next line.
				if (
					cursorLeft + nextWordWidth + 12 >=
					(containerRef.current?.offsetWidth || 0)
				) {
					setCursorLeft(0);

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
					moveCursor(8);
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

	useEffect(() => {
		setRandomWords(words.sort(() => 0.5 - Math.random()));
	}, []);

	return (
		<div className="w-full h-nav flex items-center justify-center">
			<div
				ref={containerRef}
				className="max-w-3xl w-full relative overflow-hidden max-h-[132px]"
			>
				<div
					className={clsx(
						"w-[3px] h-[35px] z-50 bg-accent rounded-full absolute transition-all duration-[50ms] ease-out",
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
							className="flex mx-1 my-1 text-3xl tracking-wider text-foreground/40"
						>
							{word.split("").map((letter, j) => (
								<p
									key={j}
									ref={(el) => {
										if (!letterRefs.current[i]) letterRefs.current[i] = [];
										letterRefs.current[i][j] = el;
									}}
									className={clsx({
										"text-foreground": correctIds[i][j] === 1,
										"text-error": correctIds[i][j] === 0,
									})}
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
