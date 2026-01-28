export interface SearchResponse {
	results: [
		{
			id: string;
			name: string;
			type: string;
		}
	];
	meta: {
		query: string;
		total: number;

		//for pagination future implementation
		// nextCursor: {
		// 	hasMore: boolean;
		// 	lastName: string;
		// 	lastId: number;
		// } | null;
	};
}
