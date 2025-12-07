import { useEffect, useRef, useState, type ReactNode } from "react";
import { useEventListener } from "@siberiacancode/reactuse";
import { cn } from "~/lib/utils";

export function Expandable({
	id,
	expanded,
	children,
	...props
}: Readonly<{
	className?: string;
	id?: string;
	expanded: boolean;
	children: ReactNode;
}>) {
	const element = useRef<HTMLDivElement>(null);
	const [frozenChildren, setFrozenChildren] = useState<ReactNode>(children);

	useEffect(() => {
		if (expanded) {
			setFrozenChildren(children);
		} else {
			const timeout = setTimeout(() => setFrozenChildren(children), 200);
			return () => clearTimeout(timeout);
		}
	}, [expanded, children]);

	const updateElementHeight = () => {
		if (!element.current) return;
		element.current.style.height = `${
			expanded ? element.current!.scrollHeight : 0
		}px`;
	};

	useEffect(() => {
		const timeoutId = setTimeout(updateElementHeight);
		return () => clearTimeout(timeoutId);
	}, [expanded]);

	useEventListener("resize", () => {
		if (!element.current) return;
		element.current.style.maxHeight = "0";
		updateElementHeight();
		element.current.style.maxHeight = "";
	});

	return (
		<div
			className={cn(
				"m-0! h-0 origin-top duration-200",
				!expanded && "invisible -translate-y-2 scale-y-75 opacity-0",
				props.className,
			)}
			id={id}
			ref={element}
			aria-hidden={!expanded}
		>
			{frozenChildren}
		</div>
	);
}
