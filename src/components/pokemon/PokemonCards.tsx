import { Match, Switch, VoidComponent, createEffect } from "solid-js";
import { TbLoader } from "solid-icons/tb";
import { trpc } from "~/lib/api";
import { showToast } from "../ui/toast";

type VoteFuncProps = { for: number; against: number; };

const PokemonCards: VoidComponent<{ data: number[], isRefetching: boolean, refetch: () => void }> = (props) => {
  const mutation = trpc.pokemon.vote.useMutation();

  createEffect(() => {
    if (mutation.isError) {
      return showToast({
        variant: "destructive",
        title: "error",
        description: mutation.error.message,
        duration: 5 * 1000
      })
    }
  })

  return (
    <>
      <div class="w-full flex justify-center gap-4">
        <div class="flex-col">
          <div class="flex-row justify-center flex gap-14">
            <PokemonCard
              id={props.data[0]}
              isLoading={props.isRefetching}
              otherId={props.data[1]}
              refetch={() => props.refetch()}
              vote={(opts) => mutation.mutate(opts)}
            />
            <PokemonCard
              id={props.data[1]}
              isLoading={props.isRefetching}
              otherId={props.data[0]}
              refetch={() => props.refetch()}
              vote={(opts) => mutation.mutate(opts)}
            />
          </div>
        </div>
      </div>
    </>
  );
};


const PokemonCard: VoidComponent<{
  id: number, isLoading: boolean, otherId: number, refetch: () => void, vote: (opts: VoteFuncProps) => void
}> = (
  props
) => {

    return (
      <div class="w-32 h-32 bg-themeColor rounded-md flex justify-center items-center">
        <Switch>
          <Match when={props.isLoading}>
            <TbLoader size={64} class="animate-spin" />
          </Match>
          <Match when={!props.isLoading}>
            <button onClick={() => {
              props.vote({
                for: props.id,
                against: props.otherId
              });
              props.refetch();
            }}><img width={128} src={`/api/pokemon/image/${props.id}.png`} /></button>

          </Match>
        </Switch>
      </div>
    );
  };

export default PokemonCards;
