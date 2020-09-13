// Products

export interface PreviewProduct {
    name: string;
    price: number;
    urls: string[];
}

export class Product implements PreviewProduct{

    // sellerUid: string;
    urls: string[];
    constructor() {
        this.urls = [];
    }
    id: string;
    name: string;
    description?: string;
    type?: string;
    brand?: string;
    collection?: any[];
    category?: string;
    price: number;
    sale?: boolean;
    discount?: number;
    stock?: number;
    new?: boolean;
    quantity?: number;
    tags?: any[];
    variants?: Variants[];
    additionalDetails: any;
}

export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}
