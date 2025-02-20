import axiosInstance from "../axiosInstance";
import { getTaxRates } from "../index";
import { TaxBracketsType } from "../../features/taxCalculator/types";

jest.mock("../axiosInstance"); // Mock the custom axios instance

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe("Get Tax Rate API", () => {
  const mockYear = "2020";
  const mockResponse: TaxBracketsType = {
    tax_brackets: [
      { max: 48535, min: 0, rate: 0.15 },
      { max: 97069, min: 48535, rate: 0.205 },
    ],
  };

  it("should call the get tax rate API and return data", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await getTaxRates(mockYear);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/tax-calculator/tax-year/${mockYear}`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error when the API call fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    await expect(getTaxRates(mockYear)).rejects.toThrow("API Error");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `/tax-calculator/tax-year/${mockYear}`
    );
  });
});
