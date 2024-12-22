
/**
 * Типы и интерфейсы для аутентификации и работы с пользователями
 */

import { Dish, Price } from "./database.types.ts";

/**
 * Интерфейс запроса для входа пользователя
 *  mail - email пользователя
 *  password - пароль пользователя
 */
export interface ILoginRequest {
    mail: string;
    password: string;
}

/**
 * Интерфейс запроса для регистрации нового пользователя
 *  mail - email пользователя
 *  password - пароль пользователя
 *  name - имя пользователя
 *  phone_number - номер телефона (опционально)
 */
export interface IRegisterRequest {
    mail: string;
    password: string;
    name: string;
    phone_number?: string; // Опциональное поле
}

/**
 * Интерфейс ответа с токеном авторизации
 *  access_token - JWT токен для доступа
 *  token_type - тип токена (например, "bearer")
 */
export interface IToken {
    access_token: string;
    token_type: string;
}

/**
 * Интерфейс ответа с данными клиента
 *  clientid - уникальный идентификатор клиента
 *  mail - email клиента
 *  name - имя клиента
 *  phone_number - номер телефона (опционально)
 *  is_admin - флаг администратора
 *  discount_percentage - процент скидки клиента
 */
export interface IClientResponse {
    clientid: number;
    mail: string;
    name: string;
    phone_number?: string; // Опциональное поле
    is_admin: boolean;
    discount_percentage: number;
}


// Вспомогательные типы для API
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export type DishResponse = ApiResponse<Dish[]>;
export type PriceResponse = ApiResponse<Price[]>;
