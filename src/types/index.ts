export type ProductID = string;
export type OrderID = string;

export interface IProduct {
	id: ProductID;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export type PaymentMethod = 'online' | 'offline';

export type Error = { error: string };

export type ApiOrderResponse = IOrderResult | Error;
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiProductListResponse = {
	total: number;
	items: IProduct[];
};

export type ApiProductResponse = IProduct | Error;

export type BasketInfo = {
	itemsCount: number;
};

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: OrderID;
	total: number;
}
