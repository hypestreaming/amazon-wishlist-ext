import {Component, Input, OnInit} from '@angular/core';
import {WishlistItems} from '../wishlist-user-configuration';

@Component({
	selector: 'app-wishlist-display',
	templateUrl: './wishlist-display.component.html',
	styleUrls: ['./wishlist-display.component.css']
})

export class WishlistDisplayComponent {

	/// was configuration loaded?
	@Input() loaded = false;

	@Input() title = '';
	@Input() logo = null;
	@Input() username = null;
	@Input() items: WishlistItems = [];
	@Input() wishlistUrl = null;
}
