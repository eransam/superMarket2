export const environment = {
  production: true,
  apiPath: window.location.protocol + '//' + window.location.host + '/',
  // auth:
  emailAndSSNUniqueUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/auth/ssn-email-unique/',
  registerUrl:
    window.location.protocol + '//' + window.location.host + '/api/register/',
  loginUrl:
    window.location.protocol + '//' + window.location.host + '/api/login/',

  // categories:
  categoriesUrl:
    window.location.protocol + '//' + window.location.host + '/api/categories/',

  // products:
  productsUrl:
    window.location.protocol + '//' + window.location.host + '/api/products/',
  productsImageUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/shopping/images/',
  productsCountUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/products-count/',

  //carts
  cartByUserUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/cart-by-user/', //to display when user's cart was createdAt

  // cart items
  cartItemsUrl:
    window.location.protocol + '//' + window.location.host + '/api/items/',
  cartItemsByCartUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/items-by-cart/', //to display all items in user's current cart

  //  orders:
  ordersUrl:
    window.location.protocol + '//' + window.location.host + '/api/orders/',
  ordersCountUrl:
    window.location.protocol +
    '//' +
    window.location.host +
    '/api/orders-count/',

  // cate:
  cateUrl:
    window.location.protocol + '//' + window.location.host + '/api/cate/',
};
