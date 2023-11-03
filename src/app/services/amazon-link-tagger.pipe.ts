import {Pipe, PipeTransform} from '@angular/core';
import {extension} from '../../environments/extension';

@Pipe({
	name: 'amazonLinkTagger'
})
export class AmazonLinkTaggerPipe implements PipeTransform {

	transform(value: string, ...args: any[]): any {

		let url = value;
		url += (url.indexOf('?') < 0) ? '?' : '&';
		url += 'tag=' + extension.amazonPartnerTag;
		return url;
	}

}
