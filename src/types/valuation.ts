// Vehicle Valuation API Types

export interface CalculateValuationRequest {
  vin: string;
}

export interface ValuationResponse {
  vin: string;
  make: string;
  model: string;
  year: number;
  priceUSD: number;
  priceNGN: number;
  customsDuty: number;
  vat: number;
  levy: number;
  totalValue: number;
}
