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
        this.variants = [];
        this.collection = [];
    }
    id: string;
    name: string;
    description?: string;
    type?: string; //done
    brand?: string;
    collection?: any[];
    category?: string; // done
    price: number; //done
    sale?: boolean; // done
    discount?: number; // done
    stock?: number; // done
    new?: boolean; // done
    quantity?: number; // done
    tags?: any[]; // done
    variants?: Variants[];
    archived?: boolean;
}

export class WishlistProduct extends Product{
    userId: string;
    product: Product;
}

export interface Variants {
    variant_id?: number;
    id?: number;
    sku?: string;
    size?: string;
    color?: string;
    image_id?: number;
}
