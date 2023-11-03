import {Component, NgZone, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoggerService} from '../services/logger.service';
import {GoogleAnalyticsService} from '../services/google-analytics.service';
import {TwitchAuthorization, TwitchWindow} from 'hype-twitch-types';
import {WishlistItems} from '../wishlist-user-configuration';
import {ConfigurationParserService} from '../services/configuration-parser.service';

@Component({
	selector: 'app-panel-extension',
	templateUrl: './panel-extension.component.html',
	styleUrls: ['./panel-extension.component.css', './panel-extension.component.extra.css'],
})

export class PanelExtensionComponent implements OnInit {

	/// did we load the config at least once?
	loaded = false;

	items: WishlistItems = [];

	/// latest known authorization
	auth: TwitchAuthorization;

	channelId: string;

	title = null;
	username = '';
	userImage = '';
	wishlistUrl = '';

	constructor(private zone: NgZone, private logger: LoggerService, private ga: GoogleAnalyticsService, private configurationParser: ConfigurationParserService) {
		this.logger.log('Loading extension with locale: ' + navigator.language);
	}

	ngOnInit() {
		this.ga.trackPageView('Panel');
		this.initializeCallbacks(<any>window);
	}

	private initializeCallbacks(window: TwitchWindow) {

		window.Twitch.ext.onAuthorized((auth: TwitchAuthorization) => {
			this.zone.run(() => this.onAuthorized(auth));
		});

		window.Twitch.ext.configuration.onChanged(() => {
			this.zone.run(() => this.onConfigurationChanged(window));
		});
	}

	private onAuthorized(auth: TwitchAuthorization) {
		this.logger.log('Authorized: ' + JSON.stringify(auth));
		this.auth = auth;
		this.channelId = auth.channelId;
	}

	private onConfigurationChanged(window: TwitchWindow) {

		// gilm: note that onConfigurationChanged is called before onAuthorize.

		this.loaded = true;

		if (window.Twitch.ext.configuration.broadcaster && window.Twitch.ext.configuration.broadcaster.content) {

			const text = window.Twitch.ext.configuration.broadcaster.content;
			this.logger.log('onConfigurationChanged with: ' + text);

			const object = this.configurationParser.unserialize(text);
			this.logger.dir(object);

			this.wishlistUrl = object.wishlist_url || "";
			this.title = object.title || "";
			this.userImage = object.user_logo || "";
			this.username = object.username || "";
			this.items = object.items || [];
		}
	}
}

