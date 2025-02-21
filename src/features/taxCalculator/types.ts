export interface TaxBandType {
  min: number;
  max?: number;
  rate: number;
};

export interface TaxBracketsType {
  tax_brackets: TaxBandType[];
};

export interface FormFiledsType {
  income?: string;
  year?: string;
};

export interface BandTaxTableRowType {
  key: string;
  range: string;
  rate: string;
  tax: string;
}