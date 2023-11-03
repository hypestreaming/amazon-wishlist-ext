
export interface WishlistItem {
	id: string;
	title: string;
	image: string;
	link: string;
	price?: number;
	priceSymbol?: string;
}

export type WishlistItems = Array<WishlistItem>;

export interface MyWishlistUsersRecord {
	channel_id: string;
	last_updated: number;
	url: string;
	items: WishlistItems;
}

/**
 * This is the configuration that is stored both in the dynamodb and
 * in twitch ebs.
 */
export interface WishlistUserConfiguration {
	url?: string; // backward compatible
	wishlist_url: string; // link to amazon
	title: string; // title at top of wishlist
	username: string;
	user_logo: string;
	channel_id: string;
	items: string|WishlistItems;
	last_updated: number;
}
