import {WishlistItems} from './wishlist-user-configuration';

export interface WishlistResponse {
	wishlist_url: string; // link to amazon
	items: WishlistItems;
}

