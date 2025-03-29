interface PriceProps {
  amount: string | number;
  currencyCode: string;
  className?: string;
  currencyCodeClassName?: string;
}

const Price = ({ amount, currencyCode, className = '', currencyCodeClassName = '' }: PriceProps) => {
  return (
    <div className={`some-default-styles ${className}`}>
      <span>{amount}</span>
      <span className={currencyCodeClassName}>{currencyCode}</span>
    </div>
  );
};

export default Price;
