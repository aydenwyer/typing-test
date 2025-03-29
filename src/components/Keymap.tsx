import clsx from "clsx";
import Key from "./Key";
import { KeyData } from "@/app/page";

const qwertyKeys = [
	["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
	["a", "s", "d", "f", "g", "h", "j", "k", "l"],
	["z", "x", "c", "v", "b", "n", "m"],
];

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
							<Key key={idx} keyData={keyData.find((entry) => entry.key === char)} char={char}/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Keymap;
