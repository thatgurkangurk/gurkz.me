import { getMusicIds } from "#lib/api/music.remote.js";

import { Debounced, watch } from "runed";
import { useSearchParams } from "runed/kit";

import { searchParamsSchema } from "./schemas.js";

export class MusicIdListState {
	limit;

	#params;

	#searchInput = $state("");
	#debouncedSearch: Debounced<string>;

	musicIds;

	#isPending = $derived($effect.pending() > 0 || this.searchInput !== this.debouncedSearch.current);

	constructor(initialSearchParams?: Record<string, string>, limit: number = 15) {
		this.limit = limit;

		this.#params = useSearchParams(searchParamsSchema, {
			pushHistory: false,
			noScroll: true,
			initial: $state.snapshot(initialSearchParams)
		});

		this.#searchInput = this.#params.filter ?? "";

		this.#debouncedSearch = new Debounced(() => this.#searchInput, 400);

		this.musicIds = $derived(
			getMusicIds({
				page: this.#params.page,
				limit: this.limit,
				search: this.#params.filter
			})
		);

		watch(
			() => this.#debouncedSearch.current,
			(newQuery) => {
				if (newQuery !== this.#params.filter) {
					this.#params.filter = newQuery;
					this.#params.page = 1;
				}
			}
		);

		watch(
			() => this.#params.page,
			(newPage, oldPage) => {
				if (oldPage !== undefined && newPage !== oldPage) {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			},
			{ lazy: true }
		);
	}

	get params() {
		return this.#params;
	}

	set searchInput(input: string) {
		this.#searchInput = input;
	}

	get searchInput() {
		return this.#searchInput;
	}

	get debouncedSearch() {
		return this.#debouncedSearch;
	}

	get isPending() {
		return this.#isPending;
	}
}
