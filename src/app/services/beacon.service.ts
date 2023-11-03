import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {extension} from '../../environments/extension';

@Injectable()
export class BeaconService {

	constructor(private http: HttpClient) {
	}

	public send(eventName: string, params?: any) {

		const data: any = {
			namespace: extension.extensionName,
			version: extension.extensionVersion,
			'event-name': eventName,
		};

		if (params) {
			for (const k in params) {
				if (params.hasOwnProperty(k)) {
					data[k] = params[k];
				}
			}
		}

		this.http.post<any>(environment.beaconEndpoint, JSON.stringify(data)).subscribe(() => {
		});
	}
}
