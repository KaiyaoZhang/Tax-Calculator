import { useState } from 'react';
import { Typography, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import SalaryInputForm from './components/SalaryInputForm';
import TaxDisplay from './components/TaxDisplay';
import { TaxBracketsType } from "./types";
import styles from './index.module.scss';

const TaxCalculator = () => {
    const [taxBrackets, setTaxBrackets] = useState<TaxBracketsType>({
      tax_brackets: [],
    });
    const [annualIncome, setAnnualIncome] = useState<string>('')
    const [submitForm, setSubmitForm] = useState<boolean>(false);
    const { t } = useTranslation();
    const { Title } = Typography;

    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <Title level={3}>{t("welcome")}</Title>
        </div>
        <SalaryInputForm
          setTaxBrackets={setTaxBrackets}
          setAnnualIncome={setAnnualIncome}
          setSubmitForm={setSubmitForm}
          submitForm={submitForm}
        />
        {/* show skeleton loading when the form is submitting */}
        {submitForm && <Skeleton active />}
        {/* show TaxDisplay componenet only when the form finished loading and has value returned */}
        {!submitForm && taxBrackets.tax_brackets.length > 0 && (
          <TaxDisplay taxBrackets={taxBrackets} annualIncome={annualIncome} />
        )}
      </div>
    );
};

export default TaxCalculator;