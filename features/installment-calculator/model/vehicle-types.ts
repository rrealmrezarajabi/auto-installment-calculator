export interface Vehicle {
  readonly id: string;
  readonly name: string;
  /** Fictional price in whole tomans. */
  readonly price: number;
}

export type VehiclesResponse = readonly Vehicle[];
