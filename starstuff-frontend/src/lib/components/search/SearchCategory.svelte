<script lang="ts">
	let { categoryItem, title, items, selectedItem } = $props();
</script>

{#if items.length}
	<div class="mb-1 w-full rounded-2xl bg-black/55 p-2 backdrop-blur-sm">
		<div class={`mb-2 flex items-center gap-2  border-b border-white/5 p-2  py-2`}>
			{@render categoryItem?.()}

			<h3 class="text-xs font-bold tracking-wide text-white/60 uppercase">
				{title}
			</h3>
			<span
				class="ml-2 inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400"
			>
				{items.length}
			</span>
		</div>
		<ul>
			{#each items as item, i}
				<li class="mx-2">
					<button
						type="button"
						class="w-full cursor-pointer rounded-md px-4 py-2 text-left text-sm transition-all
						 {selectedItem?.id === item.id
							? 'bg-white/15 text-white ring-1 ring-white/20'
							: 'text-white/70 hover:bg-white/5'}
      "
					>
						{item.username ?? item.name}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}
