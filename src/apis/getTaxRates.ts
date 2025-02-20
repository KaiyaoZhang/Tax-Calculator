import axios from "./axiosInstance";
import { TaxBracketsType } from "../features/taxCalculator/types";

export const getTaxRates = async (year: string): Promise<TaxBracketsType> => {
  try {
    const res = await axios.get<TaxBracketsType>(
      `/tax-calculator/tax-year/${year}`
    );
    return res.data;
  } catch (e) {
    throw e; // rethrow the error so can handle it in the UI
  }
};
