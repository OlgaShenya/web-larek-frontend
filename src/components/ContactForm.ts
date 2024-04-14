import { IContactsForm } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class ContactForm extends Form<IContactsForm> {
	private _email: HTMLInputElement;
	private _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = ensureElement<HTMLInputElement>('input[name=email]', container);
		this._phone = ensureElement<HTMLInputElement>('input[name=phone]', container);
	}

	set email(value: string) {
		this._email.value = value;
	}

	set phone(value: string) {
		this._phone.value = value;
	}
}
