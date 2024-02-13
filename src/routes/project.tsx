import { type RouteSectionProps, A } from "@solidjs/router";
 
export default function Project(props: RouteSectionProps) {
  return (
    <div>
      <A href="/projects">⬅️ back</A>
      {/* insert the child route */ props.children}
    </div>
  );
}