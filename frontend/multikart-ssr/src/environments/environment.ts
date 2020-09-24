// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  instagram_token: 'IGQVJYNnRMZAVo2UnBjb05tN1VQRWhwN3ViS3NlS2xpZA2ZAqU0RiUHVXVUdUV0YySDFEdS02WlVCZAThvR2loeHpaZAFpqVEkya1lKR1dVbjV5MmtvVTVaaUtrV2ViRXoxRWxSTmFOSlNVb2JsNVhRN25tZAAZDZD',
  stripe_token: 'STRIPE_PUBLISHABLE_KEY',
  paypal_token: 'PAYPAL_CLIENT_ID',
  delivery_econt_shop_id: '4904065',
  SHIPPMENT_CALC_URL : 'http://delivery.demo.econt.com/customer_info.php', // URL визуализиращ форма за доставка
  SHOP_CURRENCY : 'BGN', // валута на магазина (валута на Наложен платеж)
  UPDATE_ORDER_ENDPOINT : 'http://delivery.demo.econt.com/services/OrdersService.updateOrder.json', // Ендпойнта на услугата създаване или редактиране на поръчка
  PRIVATE_KEY : '4904065@8oYUU_IAUx9pA_NDOABR3nrbFtE3' // Код за свързване
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
