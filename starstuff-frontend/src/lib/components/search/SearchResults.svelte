<script lang="ts">
	import CommunityIcon from '../icons/CommunityIcon.svelte';
	import SpaceIcon from '../icons/SpaceIcon.svelte';
	import UserIcon from '../icons/UserIcon.svelte';
	import SearchCategory from './SearchCategory.svelte';

	let selectedItem = $state<any>(null);

	let { searchReponse } = $props();

	let flatlist = $derived([...(searchReponse?.results || [])]);

	const groupedResults = $derived.by(() => {
		const base: any = [
			{ key: 'user', title: 'Users', icon: UserIcon, items: [] },
			{ key: 'space', title: 'Spaces', icon: SpaceIcon, items: [] },
			{ key: 'community', title: 'Communities', icon: CommunityIcon, items: [] }
		];
		if (!flatlist.length) return base;
		for (const item of searchReponse.results) {
			const group = base.find((g: any) => g.key === item.type);
			if (group) group.items.push(item);
		}
		return base;
	});
	const navigationList = $derived(groupedResults.flatMap((g: any) => g.items));

	const handleKeyDown = (event: KeyboardEvent) => {
		if (!flatlist.length) return;

		// Find where we are in the visual list
		const currentIndex = navigationList.findIndex((item: any) => item.id === selectedItem?.id);

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			const nextIndex = Math.min(currentIndex + 1, navigationList.length - 1);
			selectedItem = navigationList[nextIndex];
		}
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			const prevIndex = Math.max(currentIndex - 1, 0);
			selectedItem = navigationList[prevIndex];
		}
	};
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class=" max-h-105 min-h-0 gap-2 overflow-y-auto pt-4 text-white/80">
	{#each groupedResults as { title, icon: IconComponent, items }, index (title)}
		<SearchCategory {title} {items} {selectedItem}
			>{#snippet categoryItem()}
				<IconComponent />
			{/snippet}
		</SearchCategory>
	{/each}
</div>
