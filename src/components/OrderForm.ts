import { IOrderForm, PaymentMethod } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IPaymentEvent {
	payment: PaymentMethod;
}

export class OrderForm extends Form<IOrderForm> {
	private _paymentCard: HTMLButtonElement;
	private _paymentCash: HTMLButtonElement;
	private _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);
		this._paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', container);
		this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

		this._paymentCard.addEventListener('click', () => (this.payment = 'online'));
		this._paymentCash.addEventListener('click', () => (this.payment = 'offline'));
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.remove('button_alt-active');
		this._paymentCash.classList.remove('button_alt-active');
		if (value === 'online') {
			this._paymentCard.classList.add('button_alt-active');
		} else if (value === 'offline') {
			this._paymentCash.classList.add('button_alt-active');
		}
		this.events.emit('order.payment:change', { field: 'payment', value });
	}

	resetPayment() {
		this._paymentCard.classList.remove('button_alt-active');
		this._paymentCash.classList.remove('button_alt-active');
	}
}
