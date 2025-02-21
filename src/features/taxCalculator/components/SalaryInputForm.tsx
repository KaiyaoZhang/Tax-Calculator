import { useMemo, Dispatch, SetStateAction, useCallback, JSX } from "react";
import { Button, Form, Input, Select, notification } from "antd";
import type { FormProps } from "antd";
import { useTranslation } from "react-i18next";
import { getTaxRates } from "../../../apis";
import { FormFiledsType, TaxBracketsType } from "../types";
import styles from "../index.module.scss";

const { Option } = Select;

interface SalaryInputFormProps {
  setTaxBrackets: Dispatch<SetStateAction<TaxBracketsType>>;
  setAnnualIncome: Dispatch<SetStateAction<string>>;
  setSubmitForm: Dispatch<SetStateAction<boolean>>;
  submitForm: boolean;
}

const SalaryInputForm = ({
  setTaxBrackets,
  setAnnualIncome,
  setSubmitForm,
  submitForm,
}: SalaryInputFormProps): JSX.Element => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  const selectOptions: string[] = useMemo(
    () => ["2019", "2020", "2021", "2022"],
    []
  );

 const incomeInputRules = useMemo(
   () => [
     {
       required: true,
       message: t("income_validate_empty"), // Validation: Field cannot be empty
     },
     {
       pattern: /^\d+(\.\d{1,2})?$/,
       message: t("income_validate_number"), // Validation: Must be a valid number (up to two decimal places)
     },
     {
       validator: (_: unknown, value: string) => {
         if (!value || parseFloat(value) > 0) {
           return Promise.resolve();
         }
         return Promise.reject(
           new Error(t("income_validate_greater_than_zero"))
         );
       },
       // Validation: Must be greater than 0
     },
   ],
   [t]
 );


  const yearSelectRules = useMemo(
    () => [{ required: true, message: t("year_validate_empty") }], // Validation: Tax year cannot be empty
    [t]
  );

  const onFinish: FormProps<FormFiledsType>["onFinish"] = useCallback(
    async (values: FormFiledsType) => {
      setSubmitForm(true);
      try {
        const { income, year } = values;
        if (income && year) {
          setAnnualIncome(income);
          const taxRates: TaxBracketsType | null = await getTaxRates(year);
          if (taxRates) {
            setTaxBrackets(taxRates);
          }
        }
      } catch (e) {
        //Handle the API error
        api["error"]({
          message: t("notification"),
          description: t("APIError"),
        });
        setTaxBrackets({ tax_brackets: [] });
        console.error("API Error:", e);
      } finally {
        setSubmitForm(false);
      }
    },
    [setAnnualIncome, setTaxBrackets, t]
  );

  return (
    <div className={styles.form}>
      {contextHolder}
      <Form layout={"inline"} form={form} name="basic" onFinish={onFinish}>
        <Form.Item<FormFiledsType>
          label={t("income")}
          name={"income"}
          rules={incomeInputRules}
        >
          <Input prefix="$" placeholder="0" data-testid="income_input" />
        </Form.Item>
        <Form.Item<FormFiledsType>
          label={t("year")}
          name={"year"}
          rules={yearSelectRules}
        >
          <Select
            placeholder={t("year_placeholder")}
            className={styles.formSelect}
            data-testid="year_select"
          >
            {selectOptions.map((year, index) => (
              <Option
                value={year}
                key={index}
                data-testid={`select_option_${year}`}
              >
                {year}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitForm}>
            {t("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SalaryInputForm;
