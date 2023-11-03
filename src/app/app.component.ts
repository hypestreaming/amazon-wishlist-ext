import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

	is_panel = false;
	is_config = false;
	is_overlay = false;
	is_video = false;
	is_mobile = false;

	constructor(private activatedRoute: ActivatedRoute) {
	}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((map) => {
			const mode = (map.mode ? map.mode : '');
			const anchor = (map.anchor ? map.anchor : '');
			const platform = (map.platform ? map.platform : '');

			this.is_panel = (mode === 'viewer' && anchor === 'panel');
			this.is_config = (mode === 'config');
			this.is_mobile = (mode === 'viewer' && platform === 'mobile');
			this.is_overlay = (mode === 'viewer' && anchor === 'component');
			this.is_video = (mode === 'viewer' && anchor === 'video_overlay');
		});
	}

}
