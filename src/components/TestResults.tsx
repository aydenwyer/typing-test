import Keymap from "./Keymap";

const TestResults = ({ wpm, keyData }: { wpm: number, keyData: any}) => {
	return (
		<div className="flex justify-between w-full">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<p className="text-foreground/40">WPM</p>
					<p className="text-accent text-7xl font-medium">
						{Math.ceil(wpm)}
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
						<p className="font-medium text-4xl text-foreground">32s</p>
					</div>
				</div>
			</div>

			<Keymap keyData={keyData}/>
		</div>
	);
};

export default TestResults;
