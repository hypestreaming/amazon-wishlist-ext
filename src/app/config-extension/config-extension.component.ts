import {Component, NgZone, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoggerService} from '../services/logger.service';
import {GoogleAnalyticsService} from '../services/google-analytics.service';
import {WishlistItems, WishlistUserConfiguration} from '../wishlist-user-configuration';
import {ConfigurationParserService} from '../services/configuration-parser.service';
import {TwitchService} from '../services/twitch.service';
import {TwitchAuthorization, TwitchWindow} from "twitch-typings";

interface FetchResponse {
	status: string;
	items?: WishlistItems;
}

interface FetchRequest {
	url: string;
}

@Component({
	selector: 'app-config-extension',
	templateUrl: './config-extension.component.html',
	styleUrls: ['./bootstrap.min.css', '../panel-extension/panel-extension.component.css', './config-extension.component.css']
})

export class ConfigExtensionComponent implements OnInit {

	wishlistUrl = '';

	auth: TwitchAuthorization;

	show_loader = false;

	ERROR_MESSAGE = 'Ouch! That didn\'t work. Please check the Wishlist URL and try again.';
	SUCCESS_MESSAGE = 'Success! Head over to your channel to see the extension.';

	videoTutorialVisible = false;

	title = '';
	userImage = '';
	items: WishlistItems = [];

	dayOptions = [];

	status_text = '';

	configuration: WishlistUserConfiguration = {
		wishlist_url: '',
		title: null,
		username: '',
		user_logo: '',
		channel_id: '',
		items: [],
		last_updated: 0,
	};

	constructor(private http: HttpClient, private twitch: TwitchService, private logger: LoggerService, private ga: GoogleAnalyticsService, private zone: NgZone, private configurationParser: ConfigurationParserService) {
		for (let i = 1; i <= 31; i++) {
			this.dayOptions.push(i);
		}

		this.initializeCallbacks(<any>window);
	}

	ngOnInit() {
		this.ga.trackPageView('Config');
	}

	onTextChanged(event) {
		this.wishlistUrl = event.target.value;
	}

	onTitleChanged(event) {
		this.title = event.target.value;
	}

	onFetchSuccessful(wishlistUrl: string, data: FetchResponse) {

		this.items = data.items;
		this.configuration.items = data.items;
		this.configuration.title = this.title;
		this.configuration.wishlist_url = this.wishlistUrl;
		this.configuration.last_updated = Date.now();

		const serialized = this.configurationParser.serialize(this.configuration);

		this.logger.log("Saving configuration: " + JSON.stringify(this.configuration));
		this.logger.log(`When stringified, this configuration takes: ${serialized.length} bytes`);

		(<any>window).Twitch.ext.configuration.set('broadcaster', '1', serialized);

		this.show_loader = false;
		this.status_text = this.SUCCESS_MESSAGE;
	}

	onFetchFailed(url: string) {
		this.show_loader = false;
		this.status_text = this.ERROR_MESSAGE;
	}

	onUpdateClicked(): boolean {

		if (this.wishlistUrl === '') {
			return false;
		}

		this.logger.log('Update clicked with url: ' + this.wishlistUrl);

		const options: any = {
			headers: new HttpHeaders({'Authorization': 'Bearer ' + this.auth.token}),
		};

		const params: FetchRequest = {
			url: this.wishlistUrl,
		};

		const url = environment.apiEndpoint + '/api/wishlist.fetch/';

		this.show_loader = true;
		this.status_text = '';

		this.http.post<FetchResponse>(url, params, options).subscribe((data: any) => {
			this.logger.log('Got fetch response: ' + JSON.stringify(data));

			if (data && data.status && data.status === 'ok') {
				this.onFetchSuccessful(this.wishlistUrl, data);
			} else {
				this.onFetchFailed(this.wishlistUrl);
			}

		}, (error) => {
			this.logger.log('Method wishlist.fetch failed with ' + error);
			this.onFetchFailed(this.wishlistUrl);
		});

		return false;
	}

	private initializeCallbacks(window: TwitchWindow) {
		window.Twitch.ext.onAuthorized((auth: TwitchAuthorization) => {
			this.zone.run(() => this.onAuthorized(auth));
		});

		window.Twitch.ext.configuration.onChanged(() => {
			this.zone.run(() => this.onConfigurationChanged());
		});
	}

	onAuthorized(auth: TwitchAuthorization) {
		this.auth = auth;
		this.logger.log('onAuthorized: ' + JSON.stringify(auth));

		this.twitch.getUser((auth as any).helixToken, this.auth.channelId).subscribe((response) => {
			const twitchUser = response.data[0];
			this.logger.log('Resolved authorized user: ' + twitchUser.login);
			this.configuration.username = twitchUser.login;

			if (this.configuration.title === null) {
				this.title = twitchUser.login + '\'s Wishlist';
				this.configuration.title = this.title;
			}

			this.logger.log('Resolved channel logo: ' + twitchUser.profile_image_url);
			this.userImage = twitchUser.profile_image_url;
			this.configuration.user_logo = twitchUser.profile_image_url;
		});
	}

	onConfigurationChanged() {
		const configuration = (<any>window).Twitch.ext.configuration;

		// gilm: note that onConfigurationChanged is called before onAuthorize.

		if (configuration.broadcaster && configuration.broadcaster.content && configuration.broadcaster.content !== '{}') {
			const text = configuration.broadcaster.content;
			this.logger.log('Configuration changed: ' + text);

			const json: WishlistUserConfiguration = this.configurationParser.unserialize(text);
			this.configuration = json;
			this.logger.dir(json);

			this.wishlistUrl = (json.url ? json.url : json.wishlist_url);
			this.items = [];
			if (typeof (json.items) === 'string') {
				this.items = JSON.parse(json.items);
			} else if (typeof (json.items) === 'object') {
				this.items = json.items;
			}

			this.userImage = json.user_logo;
			this.title = json.title;
		}
	}

	onWatchDemoClicked() {
		this.videoTutorialVisible = true;
		return false;
	}
}
