<script lang="ts">
	import GlobalSearchModal from '$lib/components/search/SearchModal.svelte';

	let modalOpen = $state(false);

	// Cmd+K / Ctrl+K
	const toggleModal = (e?: KeyboardEvent) => {
		if (e) {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				modalOpen = !modalOpen;
			}
			if (e.key === 'Escape' && modalOpen) {
				modalOpen = false;
			}
		}
	};
</script>

<svelte:window onkeydown={toggleModal} />

<main
	class="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-center text-white"
>
	<h1 class="mb-4 text-3xl font-bold md:text-5xl">Welcome to Starstuff</h1>
	<p class="text-lg text-gray-400">
		Press <button
			class="rounded bg-white/20 px-2 py-1 font-semibold"
			onclick={() => (modalOpen = true)}>Ctrl+K</button
		>

		<button class="rounded bg-white/20 px-2 py-1 font-semibold" onclick={() => (modalOpen = true)}
			>Cmd+K</button
		> to search
	</p>
</main>

{#if modalOpen}
	<GlobalSearchModal />
{/if}
