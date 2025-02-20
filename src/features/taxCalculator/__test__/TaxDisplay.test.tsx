import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18nTestConfig from "../../../testWrappers/i18nTestConfig";
import TaxDisplay from "../components/TaxDisplay";

const { t } = i18nTestConfig;

jest.mock("../../../apis", () => ({
  getTaxRates: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("Tax display page", () => {
  const mockProps = {
    taxBrackets: {
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
    },
    annualIncome: "250000",
  };

  it("it should show the proper page when have taxBrackets and annualIncome value", () => {
    const { container } = render(
      <I18nextProvider i18n={i18nTestConfig}>
        <TaxDisplay {...mockProps} />
      </I18nextProvider>
    );

    expect(container).toMatchSnapshot();

    expect(screen.getByText(t("tax_break_down_table"))).toBeInTheDocument();
    expect(screen.getByText(t("table_col_income_range"))).toBeInTheDocument();
    expect(screen.getByText(t("table_col_tax_owed"))).toBeInTheDocument();
    expect(screen.getByText(t("table_col_tax_rate"))).toBeInTheDocument();
  });

  it("it should not show the page if annualIncome doesn't have a value", () => {
    const newMockProps = {
      ...mockProps,
      annualIncome: "",
    };
    render(
      <I18nextProvider i18n={i18nTestConfig}>
        <TaxDisplay {...newMockProps} />
      </I18nextProvider>
    );

    expect(
      screen.queryByText(t("tax_break_down_table"))
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(t("table_col_income_range"))
    ).not.toBeInTheDocument();
  });
});
