import {Injectable} from '@angular/core';

@Injectable()
export class GoogleAnalyticsService {

	constructor() {
	}

	public trackPageView(title: string) {
		const ga = window['ga'];
		if (ga) {
			ga('send', 'pageview', title);
		}
	}

	public trackEvent(category: string, action: string, label: string) {
		const ga: any = window['ga'];
		if (ga) {
			ga('send', 'event', category, action, label);
		}
	}

	public getOptimizeExperiment(): string {
		const w = <any>window;
		return w.googleExperiment ? w.googleExperiment : null;
	}
}
