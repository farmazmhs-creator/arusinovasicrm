# Intelligence Layer

## Messy Inputs Captured
- Unstructured sales notes in `activities.body`
- Historical quote outcomes (status, days-to-close, discount applied)
- Rep name + approval rate per rep
- Customer tier, reorder frequency, previous PO count
- Quote timing vs customer's procurement cycle month

## Auto-Structure Schema (stored in `quotations.deal_score_source` JSON)
```json
{
  "factors": [
    { "name": "repeat_customer", "value": true, "weight": 0.25, "signal": "+" },
    { "name": "rep_approval_rate", "value": 0.82, "weight": 0.20, "signal": "+" },
    { "name": "sent_within_24h", "value": true, "weight": 0.15, "signal": "+" },
    { "name": "committee_required", "value": true, "weight": 0.20, "signal": "-" },
    { "name": "days_waiting", "value": 3, "weight": 0.20, "signal": "-" }
  ],
  "score": 0.78,
  "confidence": 0.78,
  "review_status": "unreviewed"
}
```

## Events to Track
- Quote created, sent, approved, rejected, expired
- Days from created → sent; days from sent → approved
- Discount % applied; approval required flag
- Rep identity; customer previous order count

## Scoring Rules (v1 — rule-based, no ML)
- Repeat customer (≥3 orders): +25 pts
- Rep historical approval rate > 75%: +20 pts
- Quote sent within 24 h of creation: +15 pts
- Committee approval required: −20 pts
- Days waiting > rep average: −15 pts
- Total normalised to 0–100%; stored as `deal_score`

## What Gets Ranked
- Quotations by deal_score on sales rep dashboard
- Customers by health_score on ops dashboard

## v1 vs Later
- **v1:** Rule-based scoring (deterministic, explainable)
- **Later:** ML model trained on 935 historical deals; confidence improves with each new outcome; human review queue for low-confidence scores
