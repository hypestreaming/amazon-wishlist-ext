import {Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import {WishlistItems} from '../../wishlist-user-configuration';
import {GoogleAnalyticsService} from '../../services/google-analytics.service';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'app-simple-theme',
	templateUrl: './simple-theme.component.html',
	styleUrls: ['../../panel-extension/panel-extension.component.css', './simple-theme.component.css']
})
export class SimpleThemeComponent implements OnInit, OnChanges {

	@Input() loaded = false;

	@Input() title = '';
	@Input() logo = null;
	@Input() username = null;
	@Input() items: WishlistItems = [];
	@Input() wishlistUrl = null;

	constructor(private logger: LoggerService, private ga: GoogleAnalyticsService) {
	}

	ngOnChanges(changes: SimpleChanges) {
	}

	ngOnInit() {
	}

	onItemClicked(event: any): boolean {
		this.logger.log('Item was clicked!');
		this.ga.trackEvent('Wishlist', 'panel_item_clicked', '');
		return true;
	}
}
