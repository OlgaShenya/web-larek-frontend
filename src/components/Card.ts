import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';

interface ICardItem {
	category: string;
	title: string;
	image: string;
	price: number;
	buttonTitle: string;
}

interface ICardActions {
	onClick: (event: MouseEvent) => void;
	toggleButtonTitle?: () => string;
}

export class CardItem extends Component<ICardItem> {
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector(`.card__button`);

		if (actions) {
			if (actions.toggleButtonTitle) this.setText(this._button, actions.toggleButtonTitle());

			if (actions.onClick) {
				if (this._button) {
					this._button.addEventListener('click', (evt) => {
						actions.onClick(evt);
						if (actions.toggleButtonTitle) this.setText(this._button, actions.toggleButtonTitle());
					});
				} else {
					container.addEventListener('click', actions.onClick);
				}
			}
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this.toggleClass(this._category, 'card__category_soft', true);
				break;
			case 'другое':
				this.toggleClass(this._category, 'card__category_other', true);
				break;
			case 'дополнительное':
				this.toggleClass(this._category, 'card__category_additional', true);
				break;
			case 'кнопка':
				this.toggleClass(this._category, 'card__category_button', true);
				break;
			case 'хард-скил':
				this.toggleClass(this._category, 'card__category_hard', true);
				break;
		}
	}

	set title(text: string) {
		this.setText(this._title, text);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._price, formatNumber(value) + ' синапсов');
		}
	}

	set buttonTitle(value: string) {
		this.setText(this._button, value);
	}
}
