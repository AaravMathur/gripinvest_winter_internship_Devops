INSERT INTO investment_products 
(name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description)
VALUES
('Government Bond 2025', 'bond', 24, 7.50, 'low', 5000.00, 100000.00, 'Secure government-backed bond with fixed returns.'),
('Corporate FD Alpha', 'fd', 12, 8.20, 'moderate', 10000.00, 200000.00, 'Fixed deposit by top-rated corporate.'),
('Bluechip Mutual Fund', 'mf', 36, 12.50, 'high', 2000.00, NULL, 'Equity mutual fund focusing on bluechip companies.'),
('Tech ETF Growth', 'etf', 18, 14.00, 'high', 5000.00, NULL, 'Exchange-traded fund focusing on technology sector.');