import Set "mo:core/Set";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";

actor {
  private var nextOrderId = 0;

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Float;
    originalPrice : Float;
    discount : Nat;
    sizes : [Text];
    imageUrl : Text;
    description : Text;
    isNew : Bool;
    isFeatured : Bool;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  public type CartItem = {
    productId : Nat;
    size : Text;
    quantity : Nat;
  };

  module CartItem {
    public func compare(c1 : CartItem, c2 : CartItem) : Order.Order {
      Nat.compare(c1.productId, c2.productId);
    };
  };

  type Order = {
    id : Nat;
    principal : Principal;
    items : [CartItem];
    total : Float;
    paymentMethod : Text;
    status : Text;
    createdAt : Int;
  };

  module OrderModule {
    public func compare(o1 : Order, o2 : Order) : Order.Order {
      Int.compare(o2.createdAt, o1.createdAt);
    };
  };

  type ProductId = Nat;
  type UserId = Principal;

  let productMap = Map.empty<ProductId, Product>();
  let cartMap = Map.empty<UserId, [CartItem]>();
  let wishlistMap = Map.empty<UserId, Set.Set<Nat>>();
  let orderMap = Map.empty<UserId, [Order]>();

  public shared ({ caller }) func addProduct(product : Product) : async () {
    let id = product.id;
    productMap.add(id, product);
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (productMap.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productMap.values().toArray().sort();
  };

  public query ({ caller }) func searchProducts(keyword : Text) : async [Product] {
    let keywordLower = keyword.toLower();
    let iter1 = productMap.values();
    let iter2 = iter1.filter(
      func(p) {
        let nameLower = p.name.toLower();
        nameLower.contains(#text keywordLower);
      }
    );
    iter2.toArray().sort();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    let iter1 = productMap.values();
    let iter2 = iter1.filter(
      func(p) {
        p.isFeatured;
      }
    );
    iter2.toArray();
  };

  public query ({ caller }) func getNewArrivals() : async [Product] {
    let iter1 = productMap.values();
    let iter2 = iter1.filter(
      func(p) {
        p.isNew;
      }
    );
    iter2.toArray();
  };

  public query ({ caller }) func getCategoryProducts(category : Text) : async [Product] {
    let iter1 = productMap.values();
    let iter2 = iter1.filter(
      func(p) {
        Text.equal(p.category, category);
      }
    );
    iter2.toArray();
  };

  public shared ({ caller }) func addCartItem(item : CartItem) : async () {
    switch (productMap.get(item.productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {};
    };

    let cart = switch (cartMap.get(caller)) {
      case (null) { [] };
      case (?existing) { existing };
    };

    let updatedCart = cart.concat([item]);
    cartMap.add(caller, updatedCart);
  };

  public query ({ caller }) func getCartItems() : async [CartItem] {
    switch (cartMap.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  public shared ({ caller }) func removeCartItem(productId : Nat) : async () {
    let cart = switch (cartMap.get(caller)) {
      case (null) { [] };
      case (?c) { c };
    };

    let updatedCart = cart.filter(
      func(item) {
        item.productId != productId;
      }
    );

    cartMap.add(caller, updatedCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    cartMap.remove(caller);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, newQuantity : Nat) : async () {
    let cart = switch (cartMap.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?c) { c };
    };

    let updatedCart = cart.map(
      func(item) {
        if (item.productId == productId) {
          { item with quantity = newQuantity };
        } else {
          item;
        };
      }
    );
    cartMap.add(caller, updatedCart);
  };

  public shared ({ caller }) func addToWishlist(productId : Nat) : async () {
    switch (productMap.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (_) {};
    };

    let existingWishlist = switch (wishlistMap.get(caller)) {
      case (null) {
        let newWishlist = Set.empty<Nat>();
        wishlistMap.add(caller, newWishlist);
        newWishlist;
      };
      case (?wishlist) { wishlist };
    };

    existingWishlist.add(productId);
  };

  public shared ({ caller }) func removeFromWishlist(productId : Nat) : async () {
    let existingWishlist = switch (wishlistMap.get(caller)) {
      case (null) { Runtime.trap("Wishlist does not exist") };
      case (?wishlist) { wishlist };
    };

    existingWishlist.remove(productId);
  };

  public query ({ caller }) func isInWishlist(productId : Nat) : async Bool {
    switch (wishlistMap.get(caller)) {
      case (null) { false };
      case (?wishlist) { wishlist.contains(productId) };
    };
  };

  public query ({ caller }) func getWishlist() : async [Nat] {
    switch (wishlistMap.get(caller)) {
      case (null) { [] };
      case (?wishlist) { wishlist.toArray() };
    };
  };

  public shared ({ caller }) func placeOrder(paymentMethod : Text) : async Order {
    let cart = switch (cartMap.get(caller)) {
      case (null) { Runtime.trap("Cannot place order. Cart is empty.") };
      case (?c) { c };
    };

    switch (cart.size()) {
      case (0) { Runtime.trap("Cannot place order. Cart is empty.") };
      case (_) {};
    };

    var total = 0.0;
    for (item in cart.values()) {
      let product = switch (productMap.get(item.productId)) {
        case (null) { Runtime.trap("Product not found for id: " # item.productId.toText()) };
        case (?p) { p };
      };
      total += product.price * item.quantity.toFloat();
    };

    nextOrderId += 1;

    let newOrder = {
      id = nextOrderId;
      principal = caller;
      items = cart;
      total;
      paymentMethod;
      status = "Processing";
      createdAt = Time.now();
    };

    let existingOrders = switch (orderMap.get(caller)) {
      case (null) { [] };
      case (?orders) { orders };
    };

    let updatedOrders = existingOrders.concat([newOrder]);
    orderMap.add(caller, updatedOrders);

    cartMap.remove(caller);

    newOrder;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    let orders = switch (orderMap.get(caller)) {
      case (null) { [] };
      case (?o) { o };
    };
    orders.sort();
  };
};
