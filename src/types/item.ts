
export interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  groupId: string;
  group: string;
  supplierId: string;
  supplier: string;
  initialStock: number;
  stock: number;
  minStock: number;
  price: number;
  location: string;
}

export interface ItemFormValues {
  code: string;
  name: string;
  description?: string;
  group: string;
  supplier: string;
  initialStock: number;
  minStock: number;
  price: number;
  location?: string;
}
