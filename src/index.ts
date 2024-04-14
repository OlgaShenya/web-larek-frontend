import { AppState } from './components/AppData';
import { CardItem } from './components/Card';
import { Basket, BasketItem } from './components/Basket';
import { Page } from './components/Page';
import { ShopAPI } from './components/ShopAPI';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { IContactsForm, IOrderForm, IProduct, PaymentMethod } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IPaymentEvent, OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const appData = new AppState({}, events);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);

api
	.getProducts()
	.then(appData.setGallery.bind(appData))
	.catch((err) => console.log(`Error: ${err}`));

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on<IProduct[]>('items:change', (prods) => {
	page.gallery = prods.map((prod) => {
		const cardItem = new CardItem(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('product:select', prod),
		});

		return cardItem.render(prod);
	});
});

events.on<IProduct>('product:select', (prod) => {
	const card = new CardItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => appData.toggleInBasket(prod),
		toggleButtonTitle: () => {
			return appData.basketContainsProduct(prod) ? 'Удалить' : 'В корзину';
		},
	});

	modal.render({
		content: card.render(prod),
	});
});

events.on('basket:update', () => {
	page.counter = appData.selectedProducts.length;

	basket.price = appData.order.total;

	basket.list = appData.selectedProducts.map((prod, i) => {
		const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), {
			onClick: () => appData.removeFromBasket(prod),
		});
		basketItem.index = i + 1;
		basketItem.title = prod.title;
		basketItem.price = prod.price;
		return basketItem.render();
	});
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:accept', () => {
	modal.render({
		content: orderForm.render({
			address: appData.order.address ? appData.order.address : '',
			payment: appData.order.payment,
			valid: false,
			errors: [],
		}),
	});
	appData.validateOrder();
});

events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: appData.order.phone ? appData.order.phone : '',
			email: appData.order.email ? appData.order.email : '',
			valid: false,
			errors: [],
		}),
	});
	appData.validateContact();
});

events.on('contacts:submit', () => {
	api
		.postOrder(appData.order)
		.then((result) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					events.emit('items:changed');
				},
			});

			success.total = appData.order.total;

			modal.render({
				content: success.render({}),
			});

			appData.clearBasket();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm; value: string & PaymentMethod }) => {
	appData.setField(data.field, data.value);
	appData.validateOrder();
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm; value: string & PaymentMethod }) => {
	appData.setField(data.field, data.value);
	appData.validateContact();
});

events.on('formErrorsDelivery:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	orderForm.valid = !address && !payment;
	orderForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join(', ');
});

events.on('formErrorsContacts:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(', ');
});
