import { KeyData, wordsPerPage } from "@/app/page";
import Keymap from "./Keymap";

const TestResults = ({
	timeElapsed,
	keyData,
}: {
	timeElapsed: number;
	keyData: KeyData;
}) => {
	var minutes = 0;
	var seconds = 0;

	if (timeElapsed > 1) {
		minutes = Math.floor(timeElapsed);
		seconds = Math.round((timeElapsed - minutes) * 60);
	} else {
		seconds = timeElapsed * 60;
	}

	return (
		<div className="flex justify-between w-full">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<p className="text-foreground/40">WPM</p>
					<p className="text-accent text-7xl font-medium">
						{Math.ceil(wordsPerPage / timeElapsed)}
					</p>
				</div>
				<div className="flex gap-6">
					<div className="flex flex-col gap-1">
						<p className="text-foreground/40">ERRORS</p>
						<p className="font-medium text-4xl text-error">4</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-foreground/40">STREAK</p>
						<p className="font-medium text-4xl text-foreground">24</p>
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-foreground/40">TIME ELAPSED</p>
						<p className="font-medium text-4xl text-foreground">
							{`${minutes}:${seconds.toFixed(0).padStart(2, "0")}`}
						</p>
					</div>
				</div>
			</div>

			<Keymap keyData={keyData} />
		</div>
	);
};

export default TestResults;
