export interface FinancialData {
  Revenue: {
    Company: {
      Payment: string;
      Paid: string;
      Ratio: string;
    };
    Individual: {
      Payment: string;
      Paid: string;
      Ratio: string;
    };
    Total: {
      Payment: string;
      Paid: string;
    };
  };
  COGS: {
    Amount: string;
    Ratio: string;
  };
  GrossProfit: {
    Payment: string;
    Paid: string;
    Ratio: string;
  };
  OperatingExpenses: {
    Other: {
      Amount: string;
      Ratio: string;
    };
    Payroll: {
      Amount: string;
      Ratio: string;
    };
    Tax: {
      Amount: string;
      Ratio: string;
    };
    Utility: {
      Amount: string;
      Ratio: string;
    };
    Total: {
      Amount: string;
      Ratio: string;
    };
  };
  NetProfit: {
    Payment: string;
    Paid: string;
    Ratio: string;
  };
}

export const financialData: FinancialData = {
  "Revenue": {
    "Company": {
      "Payment": "121028528",
      "Paid": "121028528",
      "Ratio": "84.65"
    },
    "Individual": {
      "Payment": "21944555",
      "Paid": "21944555",
      "Ratio": "15.35"
    },
    "Total": {
      "Payment": "142973083",
      "Paid": "142973083"
    }
  },
  "COGS": {
    "Amount": "61088128",
    "Ratio": "42.73"
  },
  "GrossProfit": {
    "Payment": "81884955",
    "Paid": "81884955",
    "Ratio": "57.27"
  },
  "OperatingExpenses": {
    "Other": {
      "Amount": "34255229",
      "Ratio": "23.96"
    },
    "Payroll": {
      "Amount": "25556400",
      "Ratio": "17.87"
    },
    "Tax": {
      "Amount": "3897672",
      "Ratio": "2.73"
    },
    "Utility": {
      "Amount": "10127000",
      "Ratio": "7.08"
    },
    "Total": {
      "Amount": "73836301",
      "Ratio": "51.64"
    }
  },
  "NetProfit": {
    "Payment": "8048654",
    "Paid": "8048654",
    "Ratio": "5.63"
  }
};
