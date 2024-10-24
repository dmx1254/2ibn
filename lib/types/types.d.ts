export interface CUR {
  _id: string;
  [string]: number;
  createdAt: Date;
  updatedAt: Date;
}


export interface Cart {
    productId: string;
    category: string;
    server: string;
    qty: number;
    amount: number;
    unitPrice: number;
    totalPrice: number;
    image: string;
    type: string;
    currency: string;
    valCurrency: number;
    character: string;
  }

  export interface CUR {
    _id: string;
    [string]: number;
    createdAt: Date;
    updatedAt: Date;
  }
