import clsx from "clsx";
import { useState } from "react";

type KeyDataEntry =
	| { key: string; correct: number; incorrect: number }
	| undefined;

const Key = ({ char, keyData }: { char: string; keyData: KeyDataEntry }) => {
	const [showHover, setShowHover] = useState(false);

	return (
		<div
			onMouseEnter={() => setShowHover(true)}
			onMouseLeave={() => setShowHover(false)}
			className={clsx(
				"w-[60px] relative cursor-pointer aspect-square border-1 rounded-sm flex items-center justify-center text-foreground/20",
				keyData && keyData.incorrect === 0
					? "!text-foreground bg-foreground/5"
					: keyData && keyData.correct === 0
					? "!text-error bg-error/5"
					: keyData
					? "!text-accent bg-accent/5"
					: ""
			)}
		>
			{char}
			{keyData && (
				<div
					className={clsx(
						"pointer-events-none opacity-0 transition-all duration-150 ease-in-out absolute px-4 py-4 bg-foreground/10 backdrop-blur-lg rounded-md bottom-[53px] -right-[1px] text-base flex gap-2 items-center",
						showHover && "opacity-100 bottom-[63px]"
					)}
				>
					<p className="text-accent text-4xl font-bold">
						{((keyData?.correct / (keyData?.correct + keyData?.incorrect)) * 100).toFixed(0) + "%"}
					</p>
					<div className="normal-case w-max flex flex-col">
						<p className="w-full text-foreground/40">
							Correct:{" "}
							<span className="text-foreground">{keyData?.correct}</span>
						</p>
						<p className="w-full text-foreground/40">
							Missed:{" "}
							<span className="text-foreground">{keyData?.incorrect}</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Key;
