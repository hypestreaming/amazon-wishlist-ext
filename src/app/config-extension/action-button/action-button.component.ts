import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
	selector: 'app-action-button',
	templateUrl: './action-button.component.html',
	styleUrls: ['./action-button.component.css']
})
export class ActionButtonComponent {

	@Input() text = "";
	@Output() click: EventEmitter<void> = new EventEmitter();

	constructor() {
	}

	onClick() {
		this.click.emit()
		return false;
	}

}
