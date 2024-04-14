# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Переменные окружения (в файле .env)

```
API_ORIGIN=https://larek-api.nomoreparties.co
```

---

---

# Основные типы данных

- `ProductID` ID продукта
- `OrderID` ID заказа (будет получен после завершения заказа)
- `PaymentMethod` метод оплаты ('online' или 'offline')

#### Данные продукта

```
interface IProduct {
	id: ProductID;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

#### Данные форм заказа

```
interface IOrderForm {
	payment: string;
	address: string;
}

interface IContactsForm {
	email: string;
	phone: string;
}

interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}
```

---

# Базовые классы

### `class Api`

Интерфейс обмена запросами с сервером
Выполняет минимально необходимые преобразования данных

### `class EventEmitter`

Брокер событий
В расширенных вариантах есть возможность подписаться на все события или слушать события по шаблону например

```
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

### `abstract class Model<T>`

Базовая модель, чтобы можно было отличить ее от простых объектов с данными

### `abstract class Component<T>`

Базовый компонент

- `toggleClass(element: HTMLElement, className: string, force?: boolean)`
- `setDisabled(element: HTMLElement, state: boolean)`
- `render(data?: Partial<T>): HTMLElement`

---

# Базовые компоненты

### `class Form<T> extends Component<IFormState>`

Базовый класс для всех форм

### `class Modal extends Component<IModalData>`

Базовый класс для всех модальных окон

#### События

- `{имя формы}.{имя поля}:change` ввод в input

---

# Модель данных

### Интерфейс API `class ShopAPI extends Api implements IShopAPI`

Предоставляет упрощенный интерфейс для обмена с сервером

#### Методы

- `getProduct(id: string): Promise<IProduct>` получить данные продукта по ID
- `getProducts(): Promise<IProduct[]>` получить данные всех продуктов
- `postOrder(order: IOrder): Promise<ApiOrderResponse>` отправить данные заказа

### Контроллер состояний `class AppState extends Model<IAppState>`

```
interface IAppState {
	gallery: IProduct[];
	order: IOrder;
	selectedProducts: IProduct[];
	formErrors: FormErrors;
}
```

#### Методы

- `setGallery(items: IProduct[]): void`
- `basketContainsProduct(item: IProduct): boolean`
- `addToBasket(...items: IProduct[]): void`
- `removeFromBasket(item: IProduct): void`
- `clearBasket(): void`
- `clearOrder(): void`
- `toggleInBasket(item: IProduct): void`
- `setOrderField(field: keyof IOrderForm, value: PaymentMethod & string): void`
- `setContactField(field: keyof IContactsForm,value: string): void`
- `validateOrder(): void`
- `validateContact(): void`

#### События

- `items:change`: вызывается при изменении содержимого галереи
- `basket:update`: вызывается при изменении содержимого корзины

---

# Компоненты

### `class Page extends Component<IPage>`

Отображение страницы

#### Данные

```
interface IPage {
	counter: number; // счетчик элементов в корзине
	gallery: HTMLElement[];
	locked: boolean; // блокировка прокрутки при отображении модальных окон
}
```

#### События

- `basket:open` вызывается при клипе на корзине

# Карточка продукта `class CardItem extends Component<ICardItem>`

```
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
```

### `constructor(container: HTMLElement, actions?: ICardActions)`

# Корзина `class Basket extends Component<IBasket>`

```
interface IBasket {
	list: HTMLElement[];
	price: number;
}
```

### `constructor(container: HTMLElement, protected events: EventEmitter)`

#### События

- `basket:accept` по кнопке "Далее"

## Элемент списка корзины `class BasketItem extends Component<IBasketItem>`

```
interface IBasketItem {
	index: number;
	title: string;
	price: number;
}
```

# Формы

## Форма оплаты и доставка `class OrderForm extends Form<IOrderForm>`

#### События

- `payment:change` при изменении формы оплаты

## Контакты `class ContactForm extends Form<IContactsForm>`
