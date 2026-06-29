# Nexora CashFlow API Documentation

The Nexora CashFlow AI platform exposes internal API routes to facilitate AI interactions in the frontend. 

## Base URL
In development: `http://localhost:3000/api`

---

## 1. Chatbot endpoint (`/api/chat`)

This endpoint wraps the **Groq API** (Llama-3 model) to provide fast, conversational financial support.

**Method:** `POST`
**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "message": "How do I cut down on my payroll expenses?"
}
```

**Response Body (200 OK):**
```json
{
  "response": "Here are 3 tips to reduce payroll expenses without hurting morale..."
}
```

---

## 2. Financial Advice endpoint (`/api/advice`)

This endpoint wraps the **Gemini 2.5 Flash API** to generate strategic business reports based on current cash flow data.

**Method:** `POST`
**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "financialSummary": "Revenue this month: 2.45M NGN. Expenses: 1.12M NGN. Major expense category: Payroll and Marketing."
}
```

**Response Body (200 OK):**
```json
{
  "advice": "Based on your 2.45M NGN revenue, your net cash flow is healthy..."
}
```
