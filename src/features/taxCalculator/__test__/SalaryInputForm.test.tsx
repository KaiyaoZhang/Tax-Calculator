import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AxiosError } from "axios";
import { I18nextProvider } from "react-i18next";
import i18nTestConfig from "../../../testWrappers/i18nTestConfig";
import { TaxBracketsType } from "../types";
import { getTaxRates } from "../../../apis";
import SalaryInputForm from "../components/SalaryInputForm";

const { t } = i18nTestConfig;

jest.mock("../../../apis", () => ({
  getTaxRates: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const mockResponse: TaxBracketsType = {
  tax_brackets: [
    {
      max: 48535,
      min: 0,
      rate: 0.15,
    },
    {
      max: 97069,
      min: 48535,
      rate: 0.205,
    },
    {
      max: 150473,
      min: 97069,
      rate: 0.26,
    },
    {
      max: 214368,
      min: 150473,
      rate: 0.29,
    },
    {
      min: 214368,
      rate: 0.33,
    },
  ],
};

describe("Salary input iorm page", () => {
  const salaryInputFormProps = {
    setTaxBrackets: jest.fn(),
    setAnnualIncome: jest.fn(),
    setSubmitForm: jest.fn(),
    submitForm: false,
  };

  const taxYearSelect = () => {
    fireEvent.mouseDown(screen.getByText(t("year_placeholder")));
    fireEvent.click(screen.getByTestId("select_option_2022"));
  };

  const apiNotBeenCalled = async () => {
    fireEvent.click(screen.getByText(t("submit")));

    await waitFor(() => {
      expect(getTaxRates).not.toHaveBeenCalled();
    });
  };

  it("renders the form inputs and submit button", () => {
    const { container } = render(
      <I18nextProvider i18n={i18nTestConfig}>
        <SalaryInputForm {...salaryInputFormProps} />
      </I18nextProvider>
    );

    expect(container).toMatchSnapshot();

    expect(screen.getByText(t("submit"))).toBeInTheDocument();
    expect(screen.getByText(t("year"))).toBeInTheDocument();
    expect(screen.getByText(t("income"))).toBeInTheDocument();
  });

  it("submits the form with valid input", async () => {
    (getTaxRates as jest.Mock).mockResolvedValue(mockResponse);
    render(<SalaryInputForm {...salaryInputFormProps} />);

    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "50000" },
    });

    taxYearSelect();

    fireEvent.click(screen.getByText(t("submit")));

    await waitFor(() => {
      expect(salaryInputFormProps.setAnnualIncome).toHaveBeenCalledWith(
        "50000"
      );
      expect(getTaxRates).toHaveBeenCalled();
    });
  });

  it("submits the form with valid input but API returns 500 error", async () => {
    // Spy on console.error to prevent test pollution
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock API failure with 500 error
    (getTaxRates as jest.Mock).mockRejectedValueOnce(
      new AxiosError("API Error", "500", undefined, undefined, {
        status: 500,
        statusText: "Internal Server Error",
      } as any)
    );

    render(<SalaryInputForm {...salaryInputFormProps} />);

    // Simulate user input
    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "50000" },
    });

    taxYearSelect();

    fireEvent.click(screen.getByText(t("submit")));

    // Ensure setTaxBrackets is called with an empty tax_brackets array on API failure
    await waitFor(() => {
      expect(salaryInputFormProps.setTaxBrackets).toHaveBeenCalledWith({
        tax_brackets: [],
      });
    });

    // Ensure error message is displayed
    expect(screen.getByText(t("APIServerError"))).toBeInTheDocument();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("it should not sumbit the form when there are validation fails (the input number has more than 2 dicimal)", async () => {
    render(<SalaryInputForm {...salaryInputFormProps} />);

    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "50000.256" },
    });

    taxYearSelect();

    apiNotBeenCalled();
  });

  it("it should not sumbit the form when there are validation fails (the input number is smaller than 0)", async () => {
    render(<SalaryInputForm {...salaryInputFormProps} />);

    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "-50000" },
    });

    taxYearSelect();

    apiNotBeenCalled();
  });

  it("it should not sumbit the form when there are validation fails (the input number value is not a number)", async () => {
    render(<SalaryInputForm {...salaryInputFormProps} />);

    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "hello world!" },
    });

    taxYearSelect();

    apiNotBeenCalled();
  });

  it("it should not sumbit the form when there are validation fails (There is no tax year selected)", async () => {
    render(<SalaryInputForm {...salaryInputFormProps} />);

    fireEvent.change(screen.getByTestId("income_input"), {
      target: { value: "50000" },
    });

    apiNotBeenCalled();
  });

  it("it should not sumbit the form when there are validation fails (when both annual income and tax year are empty)", async () => {
    render(<SalaryInputForm {...salaryInputFormProps} />);

    apiNotBeenCalled();
  });
});
