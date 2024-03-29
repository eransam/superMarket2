// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiPath: window.location.protocol + '//' + window.location.host + '/',
  // auth:
  emailAndSSNUniqueUrl: 'http://62.171.156.199:3001/api/auth/ssn-email-unique/',
  registerUrl: 'http://62.171.156.199:3001/api/auth/register/',
  loginUrl: 'http://62.171.156.199:3001/api/auth/login/',

  // categories:
  categoriesUrl: 'http://62.171.156.199:3001/api/categories/',

  // cate:
  cateUrl: 'http://62.171.156.199:3001/api/cate/',

  // products:
  productsUrl: 'http://62.171.156.199:3001/api/products/',
  productsImageUrl: 'http://62.171.156.199:3001/shopping/images/',
  productsCountUrl: 'http://62.171.156.199:3001/api/products-count/',

  //carts
  cartByUserUrl: 'http://62.171.156.199:3001/api/cart-by-user/', //to display when user's cart was createdAt

  // cart items
  cartItemsUrl: 'http://62.171.156.199:3001/api/items/',
  cartItemsByCartUrl: 'http://62.171.156.199:3001/api/items-by-cart/', //to display all items in user's current cart

  //  orders:
  ordersUrl: 'http://62.171.156.199:3001/api/orders/',
  ordersCountUrl: 'http://62.171.156.199:3001/api/orders-count/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
