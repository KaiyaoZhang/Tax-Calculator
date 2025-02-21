import { JSX, useMemo } from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { TaxBracketsType, BandTaxTableRowType } from "../types";

interface TaxDisplayProps {
  taxBrackets: TaxBracketsType;
  annualIncome: string;
}

const TaxDisplay = ({
  taxBrackets,
  annualIncome,
}: TaxDisplayProps): JSX.Element | null => {
  const { Title } = Typography;
  const { t } = useTranslation();

  const columns: ColumnsType<BandTaxTableRowType> = useMemo(
    () => [
      {
        title: t("table_col_income_range"),
        dataIndex: "range",
        key: "range",
      },
      {
        title: t("table_col_tax_rate"),
        dataIndex: "rate",
        key: "rate",
      },
      {
        title: t("table_col_tax_owed"),
        dataIndex: "tax",
        key: "tax",
      },
    ],
    [t]
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }),
    []
  );

  const formatCurrency = (value: number): string =>
    currencyFormatter.format(value);

  // Calculate the tax band details
  const calculatedTaxDetails = useMemo(() => {
    let remainingSalary = Number(annualIncome);
    let taxAcc = 0;
    const bandBreakdown: BandTaxTableRowType[] = [];

    for (let index = 0; index < taxBrackets.tax_brackets.length; index++) {
      const band = taxBrackets.tax_brackets[index];
      if (remainingSalary <= 0) break;

      const bandMin = band.min;
      const bandMax = band.max ?? Infinity;
      const taxableInBand = Math.min(remainingSalary, bandMax - bandMin);

      // Set the tax, rate, and range for each band and format them to use in Antd Table data source
      if (taxableInBand > 0) {
        const taxInBand = taxableInBand * band.rate;
        taxAcc += taxInBand;
        bandBreakdown.push({
          key: `${index}`,
          range: `${formatCurrency(bandMin)} - ${
            bandMax === Infinity ? "∞" : formatCurrency(bandMax)
          }`,
          rate: `${(band.rate * 100).toFixed(1)}%`,
          tax: `${formatCurrency(taxInBand)}`,
        });
        remainingSalary -= taxableInBand;
      }
    }

    const effectiveRate = (taxAcc / Number(annualIncome)) * 100;

    return { totalTax: taxAcc, bandDetails: bandBreakdown, effectiveRate };
  }, [annualIncome, taxBrackets]);

  // Early return when annualIncome is empty or smaller than 0
  if (annualIncome === "" || Number(annualIncome) <= 0) {
    return null;
  }

  return (
    <div>
      <Title level={3}>{t("tax_break_down_table")}</Title>
      <Table
        dataSource={calculatedTaxDetails.bandDetails}
        columns={columns}
        pagination={false}
        bordered
      />
      <Title level={3}>
        {t("totalTaxes", {
          totalTaxes: formatCurrency(calculatedTaxDetails.totalTax),
        })}
      </Title>
      <Title level={3}>
        {`${t("effectiveRate", {
          effectiveRate: calculatedTaxDetails.effectiveRate.toFixed(2),
        })}%`}
      </Title>
    </div>
  );
};

export default TaxDisplay;
