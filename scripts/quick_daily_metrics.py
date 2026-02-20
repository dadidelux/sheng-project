#!/usr/bin/env python3
"""
Quick Daily Metrics Analysis for L2_dec_roster.csv
Simplified version for quick analysis and testing.
"""

import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

def quick_daily_analysis(csv_path, days_back=7):
    """Quick daily metrics analysis."""
    print(f"🚀 Quick Daily Metrics Analysis for {csv_path}")
    print(f"📅 Analyzing last {days_back} days...")
    
    # Load data
    print("📊 Loading data...")
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded {len(df):,} records")
    
    # Create daily metrics
    daily_data = []
    end_date = datetime.now()
    
    for i in range(days_back):
        date = end_date - timedelta(days=i)
        
        # Sample data for each day (in real scenario, you'd filter by actual dates)
        sample_size = min(500, len(df))
        daily_sample = df.sample(n=sample_size, random_state=int(date.timestamp()))
        
        # Calculate key metrics
        poverty_rate = (daily_sample['poverty_status'].str.contains('Poor').sum() / len(daily_sample)) * 100
        avg_household_size = daily_sample['no_of_indiv'].mean()
        electricity_rate = (daily_sample['has_electricity'] == 1).sum() / len(daily_sample) * 100
        program_rate = (daily_sample['received_programs'] == 1).sum() / len(daily_sample) * 100
        
        daily_data.append({
            'date': date.strftime('%Y-%m-%d'),
            'poverty_rate': round(poverty_rate, 2),
            'avg_household_size': round(avg_household_size, 2),
            'electricity_rate': round(electricity_rate, 2),
            'program_rate': round(program_rate, 2)
        })
    
    # Create DataFrame
    daily_df = pd.DataFrame(daily_data)
    daily_df = daily_df.sort_values('date')
    
    # Display results
    print("\n📈 DAILY METRICS SUMMARY:")
    print("="*50)
    print(daily_df.to_string(index=False))
    
    # Create simple visualization
    print("\n🎨 Creating visualization...")
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # Poverty rate trend
    ax1.plot(daily_df['date'], daily_df['poverty_rate'], 'ro-', linewidth=2, markersize=8)
    ax1.set_title('Daily Poverty Rate Trend', fontweight='bold', fontsize=14)
    ax1.set_ylabel('Poverty Rate (%)')
    ax1.grid(True, alpha=0.3)
    ax1.tick_params(axis='x', rotation=45)
    
    # Program participation trend
    ax2.plot(daily_df['date'], daily_df['program_rate'], 'bo-', linewidth=2, markersize=8)
    ax2.set_title('Daily Program Participation Rate', fontweight='bold', fontsize=14)
    ax2.set_ylabel('Program Rate (%)')
    ax2.grid(True, alpha=0.3)
    ax2.tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('quick_daily_metrics.png', dpi=300, bbox_inches='tight')
    plt.show()
    
    # Summary statistics
    print("\n📊 SUMMARY STATISTICS:")
    print("="*50)
    print(f"Average Poverty Rate: {daily_df['poverty_rate'].mean():.2f}%")
    print(f"Average Household Size: {daily_df['avg_household_size'].mean():.2f}")
    print(f"Average Electricity Access: {daily_df['electricity_rate'].mean():.2f}%")
    print(f"Average Program Participation: {daily_df['program_rate'].mean():.2f}%")
    
    # Export results
    output_file = f'quick_daily_metrics_{datetime.now().strftime("%Y%m%d")}.csv'
    daily_df.to_csv(output_file, index=False)
    print(f"\n💾 Results exported to: {output_file}")
    print(f"🖼️  Chart saved as: quick_daily_metrics.png")
    
    return daily_df

if __name__ == "__main__":
    # Run quick analysis
    results = quick_daily_analysis('data/L2_dec_roster.csv', days_back=7)










