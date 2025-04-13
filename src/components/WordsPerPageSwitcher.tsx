import { useWordsPerPage } from "@/context/WordsPerPageContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

type WordsPerPageValueType = 15 | 30 | 60;

const wordsPerPageOptions: WordsPerPageValueType[] = [
	15, 30, 60
]

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
			{wordsPerPageOptions.map((item, idx) => (<div
				id={item.toString()}
				key={idx}
				className={clsx("flex items-center justify-center text-md p-1 h-9 w-12 cursor-pointer", selected?.id === item.toString() ? "text-foreground" : "text-foreground/40")}
				onClick={(e) => handleClick(e)}
			>
				{item}
			</div>
			))}
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
