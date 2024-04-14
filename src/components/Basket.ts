import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export interface IBasket {
	list: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement('.basket__list', container);
		this._price = ensureElement('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

		this._button.addEventListener('click', () => {
			events.emit('basket:accept');
		});
	}

	set list(items: HTMLElement[]) {
		if (items.length > 0) {
			this.setDisabled(this._button, false);
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this._button, true);
		}
	}

	set price(value: number) {
		this.setText(this._price, value.toString() + ' синапсов');
	}
}

export interface IBasketItem {
	index: number;
	title: string;
	price: number;
}

interface IBasketActions {
	onClick: (event: MouseEvent) => void;
}

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IBasketActions) {
		super(container);

		this._index = container.querySelector('.basket__item-index');
		this._title = container.querySelector(`.card__title`);
		this._price = container.querySelector(`.card__price`);
		this._button = container.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			this._button.addEventListener('click', (evt) => {
				actions.onClick(evt);
			});
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, formatNumber(value) + ' синапсов');
	}
}
