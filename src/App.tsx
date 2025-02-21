import TaxCalculator from "./features/taxCalculator";
import styles from "./App.module.scss";

const App = () => {
  return (
    <div className={styles.App}>
      <TaxCalculator />
    </div>
  );
};

export default App;
