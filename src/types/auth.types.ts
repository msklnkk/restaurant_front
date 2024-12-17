export interface ILoginRequest {
    mail: string;
    password: string;
  }
  
export interface IRegisterRequest {
    mail: string;
    password: string;
    name: string;
    phone_number?: string;
}
  
export interface IToken {
    access_token: string;
    token_type: string;
}
  
export interface IClientResponse {
    clientid: number;
    mail: string;
    name: string;
    phone_number?: string;
    is_admin: boolean;
    discount_percentage: number;
}