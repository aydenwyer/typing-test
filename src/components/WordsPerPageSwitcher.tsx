import { useWordsPerPage } from "@/context/WordsPerPageContext";
import { useEffect, useState } from "react";

type WordsPerPageValueType = 15 | 30 | 60;

const WordsPerPageSwitcher = () => {
	const { wordsPerPage, setWordsPerPage } = useWordsPerPage();
	const [selected, setSelected] = useState<HTMLDivElement | null>();

	const handleClick = (el: React.MouseEvent<HTMLDivElement>) => {
		const text = el.currentTarget.textContent;
		if (!text) return;

		const newValue = Number(text) as WordsPerPageValueType;

		if ([15, 30, 60].includes(newValue)) {
			setWordsPerPage(newValue);

			setSelected(el.currentTarget);
		}
	};

	useEffect(() => {
		setSelected(document.getElementById(`${wordsPerPage}`) as HTMLDivElement);
	}, [wordsPerPage]);

	return (
		<div className="relative flex justify-center items-center w-fit p-1 bg-foreground/5 border-[1px] border-foreground/7 rounded-md gap-1">
			<div
				id="15"
				className="flex items-center justify-center text-md p-1 h-9 w-12 cursor-pointer"
				onClick={(e) => handleClick(e)}
			>
				15
			</div>
			<div
				id="30"
				className="flex items-center justify-center text-md p-1 h-9 w-12 cursor-pointer"
				onClick={(e) => handleClick(e)}
			>
				30
			</div>
			<div
				id="60"
				className="flex items-center justify-center text-md p-1 h-9 w-12 cursor-pointer"
				onClick={(e) => handleClick(e)}
			>
				60
			</div>
			{selected && (
				<div
					className="absolute transition-all duration-150 ease-[cubic-bezier(.38,.83,.4,1.18)] w-12 h-9 bg-foreground/7 rounded-sm -z-1"
					style={{ left: selected?.offsetLeft }}
				/>
			)}
		</div>
	);
};

export default WordsPerPageSwitcher;
