<script lang="ts">
	import SearchIcon from '../icons/SearchIcon.svelte';

	let { searchQuery = $bindable('') } = $props();

	//focus input when the input mount
	const focusInput = (node: HTMLInputElement) => {
		node.focus();
	};
</script>

<div class="relative w-full">
	<SearchIcon
		className="pointer-events-none absolute left-2 top-1/2 h-8 w-7 -translate-y-1/2 text-gray-500"
	/>

	<input
		class="w-full rounded-2xl border border-white/30 bg-white/10 p-3 pl-10 font-semibold
	      text-white/80 placeholder-gray-400 backdrop-blur-sm
	       transition focus:border-black focus:ring-2 focus:ring-white/10
	       focus:outline-none"
		type="search"
		placeholder="Search..."
		aria-label="search input"
		data-testid="search-input"
		bind:value={searchQuery}
		use:focusInput
	/>
	{#if searchQuery}
		<button
			class="absolute top-1/2 right-3 -translate-y-1/2 text-white/60 transition hover:text-white"
			onclick={() => (searchQuery = '')}
			aria-label="Clear search"
		>
			✕
		</button>
	{/if}
</div>

<style>
	input[type='search']::-webkit-search-cancel-button {
		display: none;
	}
</style>
