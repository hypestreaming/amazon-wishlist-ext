import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {PanelExtensionComponent} from './panel-extension/panel-extension.component';
import {ConfigExtensionComponent} from './config-extension/config-extension.component';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';
import {LoggerService} from './services/logger.service';
import {GoogleAnalyticsService} from './services/google-analytics.service';
import {WishlistDisplayComponent} from './wishlist-display/wishlist-display.component';
import {SimpleThemeComponent} from './wishlist-display/simple-theme/simple-theme.component';
import {AmazonLinkTaggerPipe} from './services/amazon-link-tagger.pipe';
import {TwitchService} from './services/twitch.service';
import { OverlayExtensionComponent } from './overlay-extension/overlay-extension.component';
import { ActionButtonComponent } from './config-extension/action-button/action-button.component';

const appRoutes: Routes = [
	{path: 'index.html', component: AppComponent},
];

@NgModule({
	declarations: [
		AppComponent,
		PanelExtensionComponent,
		ConfigExtensionComponent,
		WishlistDisplayComponent,
		SimpleThemeComponent,
		AmazonLinkTaggerPipe,
		OverlayExtensionComponent,
		ActionButtonComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
	],
	providers: [
		LoggerService,
		GoogleAnalyticsService,
		TwitchService,
	],
	bootstrap: [AppComponent]
})

export class AppModule {
}
