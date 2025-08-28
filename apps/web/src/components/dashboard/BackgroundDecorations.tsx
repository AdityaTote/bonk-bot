interface BackgroundDecorationsProps {
	className?: string;
}

export function BackgroundDecorations({
	className = "",
}: BackgroundDecorationsProps) {
	return (
		<div
			className={`absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none ${className}`}
		>
			<div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
			<div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
		</div>
	);
}
