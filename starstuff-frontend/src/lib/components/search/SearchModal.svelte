<script lang="ts">
	import { scale } from 'svelte/transition';
	import SearchIcon from '../icons/SearchIcon.svelte';
	import SearchField from './SearchField.svelte';
	import SkeletonList from './SearchLoading.svelte';
	import SearchResults from './SearchResults.svelte';

	let searchQuery: string = $state<string>('');
	let searchReponse = $state<any | null>({});
	let isLoading: boolean = $state<boolean>(false);
	let errorMessage: string = $state<string>('');

	let timer: ReturnType<typeof setTimeout>;
	let controller: AbortController | null = null;

	// Function to handle search requests with debounce and cancellation
	const handleSearch = async (query: string, signal: AbortSignal) => {
		// Debounce: wait 300ms before sending the request to avoid too many API calls
		timer = setTimeout(async () => {
			isLoading = true;
			errorMessage = '';
			try {
				// Send fetch request with AbortSignal to allow cancellation
				const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, { signal });
				if (!res.ok) throw new Error(`Search failed: ${res.status}`);

				const data = await res.json();
				searchReponse = data;
			} catch (err: any) {
				// Ignore if request was aborted, otherwise show error
				if (err.name !== 'AbortError') {
					errorMessage = 'Something went wrong';
					searchReponse = null;
				}
			} finally {
				// Only update loading state if request was not aborted
				if (!signal.aborted) isLoading = false;
			}
		}, 300);
	};

	$effect(() => {
		const trimmedQuery = searchQuery.trim();

		if (trimmedQuery.length >= 2) {
			isLoading = true;
			searchReponse = null;
			controller = new AbortController();

			handleSearch(trimmedQuery, controller.signal);
		} else {
			searchReponse = null;
			isLoading = false;
			errorMessage = '';
		}

		return () => {
			// CLEANUP: clear timer and abort previous request on dependency change/unmount
			clearTimeout(timer);
			controller?.abort();
		};
	});
</script>

<div
	transition:scale={{ duration: 130, start: 0.9 }}
	class="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/70 pt-40 backdrop-blur-md"
>
	<div
		class="w-[90%] max-w-3xl rounded-3xl border border-white/20
 bg-white/10 p-5 shadow-lg backdrop-blur-lg sm:w-[80%] md:w-[60%] lg:w-[45%]"
	>
		<SearchField bind:searchQuery />
		{#if !isLoading && !searchReponse && !errorMessage}
			{@render modelClose('mt-2')}
		{/if}
	</div>

	{#if isLoading || searchReponse || errorMessage}
		<div
			class=" result-wrapper mt-2 w-[90%]
		         	  max-w-3xl
	      	 	  rounded-3xl border
			        border-white/20 bg-white/10 px-5 pb-3 shadow-lg backdrop-blur-lg sm:w-[80%] md:w-[60%] lg:w-[45%]
"
		>
			{#if isLoading}
				<SkeletonList />
			{:else if searchReponse && searchReponse?.results?.length > 0}
				<SearchResults {searchReponse} />
				{@render footer()}
			{:else if searchReponse && searchReponse?.results?.length === 0}
				{@render noResultFoundContent()}
				{@render modelClose()}
			{:else if errorMessage}
				<div class="flex flex-col items-center justify-center p-8 text-center">
					<p class="font-medium text-red-400">{errorMessage}</p>
					<button
						onclick={() => handleSearch(searchQuery.trim(), new AbortController().signal)}
						class="mt-2 text-xs text-white/40 underline hover:text-white"
					>
						Try again
					</button>
				</div>
				{@render modelClose()}
			{/if}
		</div>{/if}
</div>

{#snippet footer()}
	<div class="mt-6 flex justify-between gap-2 text-sm text-white/70">
		<div
			class="flex items-center gap-1 rounded-md border-white/20 bg-white/10 px-4 py-0.5 text-xs text-[9px] md:text-sm"
		>
			<span>&#8593;</span>
			<span>&#8595;</span>
			<span>to navigate</span>
		</div>
		<div class="rounded-md border-white/20 bg-white/10 px-4 py-0.5 text-xs text-[9px] md:text-sm">
			Enter to select
		</div>
		<div class="rounded-md border-white/20 bg-white/10 px-4 py-0.5 text-xs text-[9px] md:text-sm">
			Esc to close
		</div>
	</div>
{/snippet}
{#snippet modelClose(mrgin: string = 'mt-6')}
	<div class="flex justify-end gap-2 text-xs text-[10px] text-white/70 md:text-sm {mrgin} ">
		<div class="rounded-md border-white/20 bg-white/10 px-4 py-0.5">Esc to close</div>
	</div>
{/snippet}
{#snippet noResultFoundContent()}
	<div class="flex flex-col items-center justify-center px-5 py-8 text-center">
		<SearchIcon className="mb-4 h-10 w-10" />

		<h3 class="text-sm font-medium text-white/80">
			No results for <span class="text-white italic">"{searchQuery}"</span>
		</h3>

		<p class="mt-2 max-w-55 text-xs leading-relaxed text-white/40">
			No users, spaces, or communities match this search.
		</p>
	</div>
{/snippet}
