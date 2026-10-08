// Level 1: read ../level-1/README.md, then build the OrderQueue class below.

export interface Order {
  id: number;
  dish: string;
  price: number;
  served: boolean;
  size: "small" | "medium" | "large";
}

export class OrderQueue {
  private orders: Order[] = [];
  private nextId: number = 1;

  add(dish: string, price: number, size: Order["size"] = "medium") {
    if (price <= 0) {
      throw new Error("price is not true");
    }
    if (!dish.trim()) {
      throw new Error("dish is not true");
    }
    const waitingorders = this.orders.filter(order => order.served === false)
    if (waitingorders.length >= 8) {
      throw new Error('order limit is full')
    }

    const NewOrder: Order = {
      id: this.nextId++,
      dish: dish.trim(),
      price: price,
      served: false,
      size: size,
    };

    this.orders.push(NewOrder);
    return NewOrder
  }


  serve(id: number) {

    if (!this.orders.length) return;
    const currentOrder = this.orders.find((order) => order.id === id);

    if (currentOrder) {

      if (this.orders.some(order => order.id < currentOrder.id && order.served === false)) {
        throw new Error('not first');
      }
      currentOrder.served = true;
    }
    else {
      throw new Error("order not found");
    }

  }

  list(status?: string): Order[] {
    if (status === "all" || !status) {
      return this.orders;
    }
    
    const servedOrder = status !== "waiting";
    return this.orders.filter(order => order.served === servedOrder);
  }

  revenue(): number {
    const servedOrders = this.orders.filter((order) => order.served );

    if (!servedOrders.length) return 0;
    const totalPriseServed = servedOrders.reduce((totalPrice, order) => {
      return totalPrice + order.price;
    }, 0);
    
    return totalPriseServed;

  }

  summary() {
    const items = {
      total: 0,
      waiting: 0,
      served: 0,
      bySize: {
        small: 0,
        medium: 0,
        large: 0,
      }
    };

    this.orders.forEach(order => {

      if (order.served) {
        items.served++;
      } else {
        items.waiting++;
      }

      items.bySize[order.size]++;

      items.total++;


    });
    return items;

  }





}





