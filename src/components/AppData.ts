import { FormErrors, IContactsForm, IOrder, IOrderForm, IProduct, PaymentMethod } from '../types';
import { emailRegex, phoneRegex } from '../utils/constants';
import { Model } from './base/Model';
import { IEvents } from './base/events';

interface IAppState {
	gallery: IProduct[];
	order: IOrder;
	selectedProducts: IProduct[];
	formErrors: FormErrors;
}

export class AppState extends Model<IAppState> {
	gallery: IProduct[];
	order: IOrder = {
		address: localStorage.address,
		total: 0,
		payment: localStorage.payment as PaymentMethod,
		email: localStorage.email,
		phone: localStorage.phone,
		items: [],
	};
	selectedProducts: IProduct[] = [];
	formErrors: FormErrors = {};

	setGallery(items: IProduct[]) {
		this.gallery = [...items];
		this.emitChanges('items:change', this.gallery);
	}

	protected updateOrder() {
		if (this.selectedProducts.length > 0) {
			const prices = this.selectedProducts.map((prod) => prod.price);
			this.order.total = prices.reduce((summ, price) => summ + price);

			this.order.items = this.selectedProducts.map((item) => item.id);
		} else {
			this.order.total = 0;
			this.order.items = [];
		}
	}

	basketContainsProduct(item: IProduct) {
		return Boolean(this.selectedProducts.find((prod) => prod.id === item.id));
	}

	addToBasket(...items: IProduct[]) {
		items.forEach((item) => {
			if (!this.basketContainsProduct(item)) {
				this.selectedProducts.push(item);
			}
		});
		this.updateOrder();
		this.emitChanges('basket:update', {
			itemsCount: this.selectedProducts.length,
		});
	}

	removeFromBasket(item: IProduct) {
		if (this.basketContainsProduct(item)) {
			this.selectedProducts = this.selectedProducts.filter((prod) => item.id !== prod.id);
			this.updateOrder();
			this.emitChanges('basket:update', {
				itemsCount: this.selectedProducts.length,
			});
		}
	}

	clearBasket() {
		this.selectedProducts = [];
		this.updateOrder();
		this.emitChanges('basket:update', {
			itemsCount: this.selectedProducts.length,
		});
		this.order.total = 0;
		this.order.items = [];
	}

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			items: [],
			total: null,
			payment: 'online',
			address: '',
		};
	}

	toggleInBasket(item: IProduct) {
		if (!this.basketContainsProduct(item)) {
			this.selectedProducts.push(item);
		} else {
			this.selectedProducts = this.selectedProducts.filter((prod) => item.id !== prod.id);
		}
		this.updateOrder();
		this.emitChanges('basket:update', {
			itemsCount: this.selectedProducts.length,
		});
	}

	setField(field: keyof IOrderForm | keyof IContactsForm, value: PaymentMethod & string) {
		this.order[field] = value;
		localStorage[field] = value;
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.emitChanges('formErrorsDelivery:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!emailRegex.test(this.order.email)) {
			errors.email = 'Проверьте корректность введеного email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.order.phone)) {
			errors.phone = 'Проверьте корректность введеного номера телефона';
		}

		this.formErrors = errors;
		this.emitChanges('formErrorsContacts:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
