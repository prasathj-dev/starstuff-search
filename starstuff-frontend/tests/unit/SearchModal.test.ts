/** @vitest-environment jsdom */
import SearchModal from '$lib/components/search/SearchModal.svelte';
import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';

describe('SearchModal', () => {
	it('renders correctly', () => {
		const { getByPlaceholderText } = render(SearchModal);
		expect(getByPlaceholderText('Search...')).toBeTruthy();
	});
});
