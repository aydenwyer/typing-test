import clsx from "clsx";

const qwertyKeys = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m"],
];

type KeyData = [{ key: string; correct: number; incorrect: number }];

const Keymap = ({ keyData }: { keyData: KeyData }) => {
	return (
		<div>
			<div className="flex flex-col gap-1">
				{qwertyKeys.map((row, idx) => (
					<div
						key={idx}
						className={clsx(
							"uppercase text-[24px] flex gap-1",
							idx === 1 && "pl-4",
							idx === 2 && "pl-8"
						)}
					>
						{row.map((char, idx) => (
							<div
								key={idx}
								className={clsx(
									"w-[60px] aspect-square border-1 rounded-sm flex items-center justify-center text-foreground/20",
									keyData.some(
										(entry) => entry.key === char && entry.incorrect === 0
									) && "!text-foreground bg-foreground/5",
									keyData.some(
										(entry) => entry.key === char && entry.correct === 0
									) && "!text-error bg-error/5",
									keyData.some((entry) => entry.key === char) &&
										"!text-accent bg-accent/5"
								)}
							>
								{char}
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Keymap;
