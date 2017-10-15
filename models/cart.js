/*
    Cart model
 */
module.exports = function Cart(OldCart) {
    this.items = OldCart.items || {};
    this.totalQty = OldCart.totalQty || 0;
    this.totalPrice = OldCart.totalPrice || 0;
    //add item to shopping cart
    this.add = function (item, id) {
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    //reduce item by one in shopping cart
    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price = this.items[id].item.price * this.items[id].qty;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    //remove all units of the item in shopping cart
    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    //helper array function for products list in view
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };

    //round total price (0.00)
    this.getTotalPrice = function() {
        return Math.round(this.totalPrice * 100) / 100;
    };

};
