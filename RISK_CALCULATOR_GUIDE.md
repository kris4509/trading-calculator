# Risk Calculator — User Guide

## What It Does

The Risk Calculator helps you set safe position sizes and daily loss limits for binary options trading on **Deriv volatility indices**. It takes your account balance, risk preferences, and actual trade history, then tells you exactly how much to stake and when to stop.

---

## How To Use It

### Step 1: Set Your Account Balance

Enter your current account balance in dollars. Use the **quick preset buttons** ($100, $500, $1k, $2.5k, $5k, $10k) to jump to common values.

### Step 2: Choose Your Risk Per Trade (%)

How much of your account are you willing to lose on a single trade?

- **1–2%** — Conservative (recommended for most traders)
- **3–5%** — Aggressive (high risk of blowing your account)
- **10%+** — Gambling, not trading

> **Example:** On a $1,000 account at 2%, you risk **$20 per trade**.

### Step 3: Set Your Daily Loss Limit (%)

How much total loss in a single day would make you stop trading?

- **5%** — Sensible daily stop-loss
- **10%** — You're willing to take a significant hit
- **20%+** — Dangerous — can wipe your account in days

> **Example:** At 5% on $1,000, you stop after losing **$50 total** in one day.

### Step 4: Select Your Primary Index

Choose the volatility index you trade most. This determines:

- **Minimum stake** (e.g., Vol 10 allows $0.50, Vol 250 requires $5)
- **Payout percentage** (higher volatility = higher payout, typically 85–95%)

| Index | Min Stake | Payout |
|-------|-----------|--------|
| Volatility 10 | $0.50 | 85% |
| Volatility 25 | $0.50 | 85% |
| Volatility 50 | $1.00 | 88% |
| Volatility 75 | $1.00 | 90% |
| Volatility 100 | $1.00 | 92% |
| Volatility 150 | $2.00 | 95% |
| Volatility 250 | $5.00 | 95% |
| Boom 1000 | $1.00 | 90% |
| Crash 1000 | $1.00 | 90% |

---

## Understanding The Outputs

### Max Stake Per Trade

```
account balance × (risk per trade ÷ 100)
```

- **Example:** $1,000 × 2% = **$20 max per trade**
- This is the most you should put on a single position
- If this is below the index minimum stake, you need a larger balance or higher risk %

### Daily Loss Limit

```
account balance × (daily loss limit ÷ 100)
```

- **Example:** $1,000 × 5% = **$50 daily limit**
- Once your total losses for the day hit this number, stop trading

### Max Losses Per Day

```
daily loss limit ÷ max stake per trade
```

- **Example:** $50 ÷ $20 = **2 losses** before hitting your limit
- After 2 consecutive losses ($20 + $20 = $40), a 3rd trade ($20) would exceed $50
- If this number is **1 or 2**, your risk per trade is too high relative to your daily limit

### Breakeven Win Rate

```
1 ÷ (1 + payout) × 100
```

- The win rate you need just to break even, given the payout structure
- **Example:** At 90% payout ($90 profit on a $100 stake): need **52.6%** win rate
- If your actual win rate is below this, you're losing money even when you "win"

---

## Risk Status Levels

The **Current Risk Status** panel tracks today's actual losses against your daily limit.

| Status | Condition | Meaning |
|--------|-----------|---------|
| **Safe** 🟢 | Losses < 50% of limit | On track — keep going |
| **Caution** 🟡 | Losses 50–80% of limit | Approaching your limit — tighten up |
| **Critical** 🔴 | Losses > 80% of limit | Nearly at your daily stop — consider stopping |

**Example:** You set a $50 daily limit. You've lost $30 today.
- Risk used: 60% → **Caution** 🟡
- Remaining: $20 → about 1 more trade at your max stake
- The gauge turns yellow to warn you're close

---

## Win Rate Reality Check

This section compares your **actual win rate** (from your trade history) against the **breakeven win rate** for your selected index.

- **Above breakeven ✅** — Your strategy is mathematically profitable
- **Below breakeven ❌** — You're losing money overall, even on winning days

If you're below breakeven, you have two options:
1. **Improve your win rate** — tighter entry filters, better setups
2. **Trade higher payout indices** — Vol 150 (95% payout) needs only 51.3% WR vs Vol 10 (85%) needs 54.1%

---

## Example Scenarios

### Scenario A: Conservative New Trader

| Setting | Value |
|---------|-------|
| Balance | $500 |
| Risk per trade | 1% |
| Daily loss limit | 5% |
| Index | Volatility 50 |

**Results:**
- Max stake: **$5**
- Daily limit: **$25**
- Max losses: **5** before hitting limit
- Breakeven WR: **53.2%**

### Scenario B: Aggressive Experienced Trader

| Setting | Value |
|---------|-------|
| Balance | $5,000 |
| Risk per trade | 2% |
| Daily loss limit | 8% |
| Index | Volatility 150 |

**Results:**
- Max stake: **$100**
- Daily limit: **$400**
- Max losses: **4** before hitting limit
- Breakeven WR: **51.3%**

---

## Recommendations Logic

The app gives personalized suggestions based on your inputs and trade history:

| Condition | Suggestion |
|-----------|-----------|
| Max stake < $1 | Your balance is too small for most indices |
| Max losses ≤ 2 | Your risk % is too high for your daily limit |
| Win rate below breakeven | Review your strategy — you're losing money |
| Win rate above breakeven | Keep going — your edge is confirmed |
| Losing streak ≥ 3 | Halve your stake until the streak breaks |
| Risk per trade > 5% | Most pros risk 1–2% per trade |
| No issues found | Your parameters look reasonable |

---

## Pro Tips

1. **Start with 1% risk per trade** until you have 100+ trades recorded
2. **Match your daily limit to your average day** — if your average losing day is $30, set your limit at $40–$50
3. **Higher volatility isn't always better** — Vol 250 pays 95% but has wild swings
4. **Use the breakeven check weekly** — if your win rate drops below breakeven for two weeks, pause and review
5. **The Risk tab reads your actual trade data** — the more you log in Sessions, the more accurate the reality check
