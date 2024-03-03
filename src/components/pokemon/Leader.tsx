export function Leader(props: {
	data: {
		leader: number;
		votes: number;
	};
}) {
	return (
		<div class="pt-2">
			<h2 class="text-xl">current leader:</h2>
			<br />
			<img
				src={`/api/pokemon/image/${props.data.leader}`}
				width={128}
				class="h-32 w-32 rounded-md bg-themeColor [image-rendering:pixelated]"
			/>
			<span>{props.data.votes} vote(s).</span>
		</div>
	);
}
