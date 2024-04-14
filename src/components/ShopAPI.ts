import {
	ApiOrderResponse,
	ApiProductListResponse,
	ApiProductResponse,
	ProductID,
	IProduct,
	IOrder,
} from '../types';
import { Api } from './base/api';

export interface IShopAPI {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: ProductID) => Promise<IProduct>;
	postOrder: (order: IOrder) => Promise<ApiOrderResponse>;
}

export class ShopAPI extends Api implements IShopAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getProduct(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((data: ApiProductResponse) => {
			if (data instanceof Error) return Promise.reject(data);
			const d = data as IProduct;
			return { ...d, image: this.cdn + d.image };
		});
	}

	getProducts(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiProductListResponse) =>
			data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
		);
	}

	postOrder(order: IOrder): Promise<ApiOrderResponse> {
		return this.post('/order', order).then((data: ApiOrderResponse) => data);
	}
}
