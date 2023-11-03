import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {extension} from '../../environments/extension';
import {Observer} from 'rxjs/internal/types';
import {Observable} from 'rxjs/internal/Observable';

interface TwitchStream {
	data: [{
		id: string;
		user_id: string;
		game_id: string;
		type: string; // live
		title: string;
		viewer_count: number;
		language: string;
		thumbnail_url: string;
	}];
}

interface TwitchInstalledExtension {
	extension: {
		id: string;
		anchor: string; // panel
		description: string;
		version: string;
	};

	installation_status: any;
}

interface TwitchUser {
	_id: string;
	type: string;
	name: string; // cannot be changed
	display_name: string; // displayable name on screen
	logo: string; // avatar
	created_at: string;
	updated_at: string;
}

interface GetUsersResponse {
	users: Array<TwitchUser>;
}

interface TwitchChannelExtensions {
	issued_at: string;
	tokens: any;
	installed_extensions: TwitchInstalledExtension[];
}

@Injectable()
export class TwitchService {

	constructor(private http: HttpClient) {
	}

	getUser(userId: string): Observable<TwitchUser> {
		return new Observable<TwitchUser>((observer: Observer<TwitchUser>) => {

			const httpOptions = {
				'headers': new HttpHeaders({
					'Accept': 'application/vnd.twitchtv.v5+json',
					'Client-ID': extension.extensionClientId,
				})
			};

			const url = 'https://api.twitch.tv/kraken/users?id=' + userId;
			this.http.get<GetUsersResponse>(url, httpOptions).subscribe((response) => {
				observer.next(response.users[0]);
			});
		});
	}
}
