import { Match, Show, Switch, VoidComponent } from "solid-js";
import { Button } from "../ui/button";
import { TbLoader } from "solid-icons/tb";

const PokemonCards: VoidComponent<{ data: number[], isRefetching: boolean, refetch: () => void }> = (props) => {
  return (
    <>
      <div class="w-full flex justify-center gap-4">
        <div class="flex-col">
          <div class="flex-row justify-center flex gap-14">
            <PokemonCard
              id={props.data[0]}
              isLoading={props.isRefetching}
            />
            <PokemonCard
              id={props.data[1]}
              isLoading={props.isRefetching}
            />
          </div>
          <div class="pt-2">
            <Button
              disabled={props.isRefetching}
              onClick={() => {
                props.refetch();
              }}
              variant={"secondary"}
              class="gap-2"
            >
              <Show when={props.isRefetching}>
                <TbLoader class="mr-2 h-4 w-4 animate-spin" />
              </Show>
              these are boring, get me new ones
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const PokemonCard: VoidComponent<{ id: number; isLoading: boolean }> = (
  props
) => {
  return (
    <div class="w-32 h-32 bg-themeColor rounded-md flex justify-center items-center">
      <Switch>
        <Match when={props.isLoading}>
          <TbLoader size={64} class="animate-spin" />
        </Match>
        <Match when={!props.isLoading}>
          <img width={128} src={`/api/pokemon/image/${props.id}.png`} />
        </Match>
      </Switch>
    </div>
  );
};

export default PokemonCards;
