import {Injectable} from '@angular/core';

import pako from 'pako';
import {LoggerService} from './logger.service';

@Injectable({
	providedIn: 'root'
})

export class ConfigurationParserService {

	constructor(private logger: LoggerService) {
	}

	public serialize(obj: any): string {
		const options = {to: 'string', level: 9};
		const compressed = pako.deflate(JSON.stringify(obj), options);
		return btoa(compressed);
	}

	public unserialize(s: string): any {

		try {
			// configuration is always JSON.stringified
			const parsed: any = JSON.parse(s);
			if (typeof (parsed) === 'object') {
				// we already have an object
				return parsed;
			}
		} catch (e) {
			this.logger.log('Unserialize json fail 1: ' + e);
		}

		try {
			// let's see if it's gzipped
			const parsed: any = JSON.parse(s);
			const raw = pako.inflate(atob(parsed), {to: 'string'});
			return JSON.parse(raw);
		} catch (e) {
			this.logger.log('Unserialize json fail 2: ' + e);
		}

		try {
			const parsed: any = JSON.parse(s);
			return JSON.parse(parsed);
		} catch (e) {
			this.logger.log('Unserialize json fail 3: ' + e);
		}

		try {
			const inflated = pako.inflate(atob(s), {to: 'string'});
			return JSON.parse(inflated);
		} catch (e) {
			this.logger.log('Unserialize json fail 4: ' + e);
		}

		return {};
	}
}
