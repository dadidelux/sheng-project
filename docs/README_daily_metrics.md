# Daily Metrics Analysis for L2_dec_roster.csv

This project provides comprehensive daily metrics analysis for your household survey data from `L2_dec_roster.csv`.

## 🚀 Quick Start

### Option 1: Quick Analysis (Recommended for first-time users)
```bash
python quick_daily_metrics.py
```

### Option 2: Comprehensive Analysis
```bash
python daily_metrics_analysis.py
```

## 📊 What You'll Get

### Daily Metrics Generated:
- **Poverty Rate Trends** - Daily poverty rate percentages
- **Household Demographics** - Average household size, family count
- **Infrastructure Access** - Electricity, water access rates
- **Social Programs** - Participation rates in various government programs
- **Geographic Distribution** - Urban vs rural breakdowns
- **Vulnerability Indicators** - Displacement, indigenous population rates

### Output Files:
- `quick_daily_metrics.png` - Simple charts
- `daily_metrics_dashboard.png` - Comprehensive 9-panel dashboard
- `daily_metrics_export.csv` - Raw daily metrics data
- `quick_daily_metrics_YYYYMMDD.csv` - Quick analysis results

## 🛠️ Installation

1. **Install Dependencies:**
```bash
pip install -r requirements_daily_metrics.txt
```

2. **Verify Your Data:**
   - Ensure `L2_dec_roster.csv` is in the `data/` folder
   - The file should contain the expected columns (see data structure below)

## 📁 Data Structure

Your CSV should contain these key columns:
- `poverty_status` - Poverty classification
- `no_of_indiv` - Number of individuals per household
- `no_of_families` - Number of families per household
- `has_electricity` - Electricity access (1=Yes, 0=No)
- `water_supply` - Water access indicators
- `received_programs` - Program participation flags
- `urb_rur` - Urban/rural classification
- `experienced_displacement` - Displacement indicators

## 🔧 Customization

### Modify Analysis Period:
```python
# In quick_daily_metrics.py
results = quick_daily_analysis('data/L2_dec_roster.csv', days_back=30)  # Change to 30 days

# In daily_metrics_analysis.py
analyzer.generate_daily_metrics(days_back=60)  # Change to 60 days
```

### Add New Metrics:
```python
# Add to the daily_metrics dictionary in daily_metrics_analysis.py
'new_metric': daily_sample['column_name'].mean(),
```

### Change Visualization Style:
```python
# Modify colors, styles in create_daily_visualizations() method
plt.style.use('ggplot')  # Different style
```

## 📈 Understanding the Results

### Key Indicators:
- **Poverty Rate**: Percentage of households classified as poor
- **Program Participation**: Engagement with government assistance programs
- **Infrastructure Access**: Basic service availability
- **Household Size**: Average number of people per household

### Trend Analysis:
- **Increasing Trends**: May indicate worsening conditions or increased reporting
- **Decreasing Trends**: May indicate improving conditions or reduced reporting
- **Stable Trends**: Consistent patterns over time

## 🚨 Important Notes

### Data Limitations:
- **No Real Date Field**: Since your CSV doesn't have actual dates, we simulate daily data using random sampling
- **Cross-Sectional Data**: This appears to be a one-time survey, not longitudinal data
- **Sample Variation**: Daily metrics show variation due to sampling, not actual daily changes

### Real-World Usage:
- **For Monitoring**: Use this to track changes when you have new data collections
- **For Planning**: Identify areas needing intervention based on current metrics
- **For Reporting**: Generate daily/weekly reports for stakeholders

## 🔍 Troubleshooting

### Common Issues:

1. **Memory Errors**: 
   - Reduce `days_back` parameter
   - Use `quick_daily_metrics.py` instead of the full version

2. **Missing Columns**:
   - Check your CSV structure matches expected columns
   - Modify the script to use available columns

3. **Visualization Errors**:
   - Ensure matplotlib and seaborn are installed
   - Check for missing data in key columns

### Performance Tips:
- Use `quick_daily_metrics.py` for large datasets
- Reduce sample size in daily sampling
- Process data in chunks for very large files

## 📚 Advanced Usage

### Custom Metrics:
```python
# Add your own calculations
custom_metric = daily_sample['your_column'].apply(your_function).mean()
```

### Export to Different Formats:
```python
# JSON export
daily_df.to_json('daily_metrics.json', orient='records')

# Excel export
daily_df.to_excel('daily_metrics.xlsx', index=False)
```

### Integration with Other Tools:
- **Power BI**: Import the exported CSV
- **Tableau**: Connect to the generated data
- **R/Python**: Use the exported data for further analysis

## 🤝 Contributing

Feel free to:
- Modify the metrics calculations
- Add new visualization types
- Improve the data processing logic
- Add error handling for edge cases

## 📞 Support

If you encounter issues:
1. Check the data structure matches expectations
2. Verify all dependencies are installed
3. Review the error messages for specific issues
4. Try the quick version first to isolate problems

---

**Happy Analyzing! 📊✨**










