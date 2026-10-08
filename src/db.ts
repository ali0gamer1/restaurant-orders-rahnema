// Level 5: read ../level-5/README.md, then build the InMemoryDb class below.

export class InMemoryDb<T extends { id: number }> {


  
  private items:Map<number, T> = new Map(); //Use map instead of record since the order is preserved.

  
  private nextId = 1;

  create(data: Omit<T, 'id'>):T{

    const newItem = {
      ...data,
      id: this.nextId++
    } as T;

    this.items.set(newItem.id, newItem);
    
    return structuredClone(newItem);

  }

  get(id: number): T | undefined {
    
    const item = structuredClone(this.items.get(id));
    return item;
  }

  getAll(): T[] {
    
    let retval:T[] = [];


    //better performance than using map + structuredClone in one line
    for(let item of this.items.values()){
      retval.push(structuredClone(item));
    }

    return retval;
  }


  update(id: number, changes: Partial<Omit<T, 'id'>>): T | undefined {


    const existingItem = this.items.get(id);

    if (!existingItem) {
      return undefined;
    }

    const updatedItem = {
      ...existingItem,
      ...changes
    } as T;

    this.items.set(id, updatedItem);
    
    return structuredClone(updatedItem);

  }


  delete(id: number): boolean {
    return this.items.delete(id);
  }
  

}
