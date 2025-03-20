
export interface WarehouseLocation {
  id: number;
  code: string;
  name: string;
  description?: string;
  rackId: string;
}

export interface Rack {
  id: number;
  code: string;
  name: string;
  description?: string;
  corridorId: string;
}

export interface Corridor {
  id: number;
  code: string;
  name: string;
  description?: string;
  warehouseId: string;
}

export interface BalanceSummary {
  warehouseId: string;
  warehouseName: string;
  currentValue: number;
  inputValue: number;
  outputValue: number;
  month: string;
  year: number;
}
