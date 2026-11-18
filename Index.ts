abstract class Resource<T extends object> {
  protected data: T[];

  constructor(data: T[]) {
    // Копируем массив и объекты, не меняя исходные данные.
    this.data = data.map((item) => ({ ...item }));
  }

  // Ищем индекс по полю и значению соответствующего типа.
  #findIndex<K extends keyof T>(key: K, val: T[K]): number {
    return this.data.findIndex((item) => item[key] === val);
  }

  get(): T[] {
    return this.data;
  }

  // Возвращаем первый найденный объект или undefined.
  getOne<K extends keyof T>(key: K, val: T[K]): T | undefined {
    const index = this.#findIndex(key, val);
    return index === -1 ? undefined : this.data[index];
  }

  // Добавляем объект и возвращаем весь массив.
  add(newObj: T): T[] {
    this.data.push(newObj);
    return this.data;
  }

  // Обновляем только переданные поля найденного объекта.
  update<K extends keyof T>(
    key: K,
    val: T[K],
    partialData: Partial<T>
  ): T | undefined {
    const index = this.#findIndex(key, val);

    if (index === -1) return undefined;

    this.data[index] = { ...this.data[index], ...partialData };

    return this.data[index];
  }

  // Удаляем и возвращаем первый найденный объект.
  delete<K extends keyof T>(key: K, val: T[K]): T | undefined {
    const index = this.#findIndex(key, val);

    if (index === -1) return undefined;

    const [removed] = this.data.splice(index, 1);
    return removed;
  }
}

// Структура пользователя.
type DataType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
};

// Исходные данные пользователей.
const mockUserData: DataType[] = [
  {
    id: 1,
    name: "Lane Mcdonald",
    phone: "1-980-603-4363",
    email: "dui@aol.com",
    address: "P.O. Box 895, 4432 Placerat, Avenue",
  },
  {
    id: 2,
    name: "Emma Ford",
    phone: "(472) 855-7514",
    email: "aliquam.ornare@protonmail.net",
    address: "P.O. Box 311, 427 Egestas Av.",
  },
  {
    id: 3,
    name: "Louis Juarez",
    phone: "1-895-966-2657",
    email: "venenatis.lacus@outlook.net",
    address: "Ap #125-478 Sit Av.",
  },
  {
    id: 4,
    name: "Zorita Mason",
    phone: "1-262-419-4287",
    email: "arcu.vel@protonmail.net",
    address: "P.O. Box 631, 1093 Metus Street",
  },
  {
    id: 5,
    name: "Harriet Acevedo",
    phone: "1-788-618-2639",
    email: "consequat.dolor@protonmail.net",
    address: "P.O. Box 769, 5046 Pellentesque, Rd.",
  },
];

// Хранилище пользователей с методами Resource.
class UserModel extends Resource<DataType> {
  constructor(data: DataType[]) {
    super(data);
  }
}

const users = new UserModel(mockUserData);

// Получаем исходный массив из пяти пользователей.
console.log("users.get()", users.get());

// Добавляем шестого пользователя.
console.log(
  "users add",
  users.add({
    id: 6,
    name: "Ivan Petrov",
    phone: "1-788-618-2639",
    email: "consequat.dolor@protonmail.net",
    address: "P.O. Box 769, 5046 Pellentesque, Rd.",
  })
);

// Проверяем поиск по разным полям.
console.log("users.getOne()", users.getOne("id", 4));
console.log("users.getOne()", users.getOne("name", "Lane Mcdonald"));
console.log("users.getOne()", users.getOne("phone", "(472) 855-7514"));
console.log("users.getOne()", users.getOne("id", 12));

// Меняем имя пользователя с id 4.
console.log(
  "users.update()",
  users.update("id", 4, { name: "Sergey" })
);

// Меняем адрес и телефон пользователя, найденного по email.
console.log(
  "users.update()",
  users.update("email", "dui@aol.com", {
    address: "Moscow, Russia",
    phone: "12345678910",
  })
);

// Несуществующая запись не изменяет массив.
console.log(
  "users.update()",
  users.update("name", "Leo Tolstoy", {
    address: "Yasnaya polyana, Russia",
  })
);

// Проверяем массив после обновлений.
console.log("users.get()3", users.get());

// Удаляем Ivan Petrov.
console.log("users.delete()", users.delete("name", "Ivan Petrov"));

// Несуществующая запись: undefined.
console.log("users.delete()", users.delete("id", 222));

// В массиве снова пять пользователей.
console.log("users.get()4", users.get());

// Структура заказа.
interface OrderDataType {
  id: number;
  price: number;
}

// Хранилище заказов с той же логикой Resource.
class OrderModel extends Resource<OrderDataType> {
  constructor(data: OrderDataType[]) {
    super(data);
  }
}

const orders = new OrderModel([
  { id: 1, price: 100 },
  { id: 2, price: 200 },
  { id: 3, price: 300 },
]);

// Получаем исходные заказы.
console.log("orders.get()", orders.get());

// Добавляем четвёртый заказ.
console.log("orders.add()", orders.add({ id: 4, price: 400 }));

// Проверяем поиск по id и цене.
console.log("orders.getOne", orders.getOne("id", 1));
console.log("orders.getOne", orders.getOne("price", 200));

// Меняем цену третьего заказа.
console.log("orders.update", orders.update("id", 3, { price: 500 }));

// Удаляем второй заказ.
console.log("orders.delete", orders.delete("id", 2));

// Останутся заказы: 1 — 100, 3 — 500, 4 — 400.
console.log("orders.get", orders.get());