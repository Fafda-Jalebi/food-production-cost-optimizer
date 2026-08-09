import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, User, Lightbulb, AlertCircle, 
  HelpCircle, RefreshCw, CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../utils/calculator';

export default function AIAdvisor({ activeBatch, batches = [] }) {
  const selectedBatch = activeBatch || batches[0] || {};
  const eco = selectedBatch.economics || {};

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `### 👋 Welcome to the AI Production Cost Advisor

I have loaded your active batch dataset for **${selectedBatch.productName || 'Mango Jam'}** (${selectedBatch.batchQuantity || 1000} ${selectedBatch.unitOfMeasure || 'kg'}).

**Current Batch Financial Summary**:
- Unit Production Cost: **₹${eco.costPerUnit || 139.53} / ${selectedBatch.unitOfMeasure || 'kg'}**
- Gross Profit Margin: **${eco.profitMarginPercentage || 12.8}%**
- Primary Cost Component: **Raw Materials (${eco.costContributions?.rawMaterialPct || 54.5}%)**
- Wastage Loss: **₹${eco.wastageCost || 7352.15} (${eco.wastagePercentage || 6.5}%)**

Ask me any operational question or select one of the quick prompts below!`,
      mode: 'DEMO_OFFLINE_AI'
    }
  ]);

  const quickPrompts = [
    "How can I reduce the unit production cost of this product?",
    "Why is my production cost high and which component should I focus on?",
    "How can I improve my gross profit margin to 25%?",
    "What happens if raw material prices increase by 15%?",
    "How does batch size scaling affect my fixed plant overheads?"
  ];

  const handleAsk = async (questionText) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || loading) return;

    // Add user message
    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          batchData: {
            ...selectedBatch,
            economics: eco
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.data.answer,
          mode: data.data.mode
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.warn('Backend call failed, using client fallback logic:', err.message);
      // Client offline AI fallback
      const fallbackText = getClientOfflineAnswer(q, selectedBatch, eco);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: fallbackText,
        mode: 'DEMO_OFFLINE_AI'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="badge badge-purple text-[10px] mb-1">Generative & Algorithmic AI</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">AI Production Cost Advisor</h1>
          <p className="text-xs text-gray-400">Context-aware expert recommendations for cost reduction and operational decision support.</p>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-2 rounded-xl text-xs">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-gray-300">Active Context:</span>
          <span className="font-bold text-white">{selectedBatch.productName || 'Batch'}</span>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Suggested Questions:</span>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(prompt)}
              className="btn btn-secondary text-xs py-1.5 px-3 bg-gray-900 border-gray-800 hover:border-purple-500/50 hover:text-purple-300 text-gray-300"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="card bg-gray-950 border-gray-800 p-6 min-h-[450px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-3xl space-y-2 p-5 rounded-2xl border text-xs leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-emerald-950/40 border-emerald-500/30 text-white font-medium' 
                : 'bg-gray-900 border-gray-800 text-gray-200'
            }`}>
              
              {msg.sender === 'ai' && msg.mode && (
                <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Operations Expert</span>
                  <span className="badge badge-purple text-[9px]">{msg.mode}</span>
                </div>
              )}

              {/* Render formatted markdown-style text */}
              <div className="prose prose-invert max-w-none whitespace-pre-line">
                {msg.text}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-purple-400 p-4 bg-purple-950/20 border border-purple-500/20 rounded-xl">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Analyzing production economics and evaluating cost reduction pathways...</span>
          </div>
        )}
      </div>

      {/* Input Prompt Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleAsk(); }}
        className="flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask a question about ingredient costs, wastage reduction, margin expansion..."
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          className="input-field text-sm py-3"
        />
        <button
          type="submit"
          disabled={loading || !inputQuestion.trim()}
          className="btn btn-primary py-3 px-6 shrink-0 shadow-lg shadow-emerald-950/40"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>

    </div>
  );
}

function getClientOfflineAnswer(q, batch, eco) {
  const query = q.toLowerCase();
  const name = batch.productName || 'Food Batch';
  const unitCost = eco.costPerUnit || 139.53;
  const margin = eco.profitMarginPercentage || 12.8;

  if (query.includes('reduce') || query.includes('lower') || query.includes('cut')) {
    return `### 💡 Operational Cost Reduction Strategy for ${name}

Unit Production Cost: **₹${unitCost} / ${batch.unitOfMeasure || 'kg'}**

1. **Raw Material Tiered Discount**: Raw materials account for **${eco.costContributions?.rawMaterialPct || 50}%** of batch cost. Negotiating a 6% volume discount saves **${formatCurrency((eco.rawMaterialCost || 70000) * 0.06)} per batch**.
2. **Process Wastage Reduction**: Cutting yield loss from ${batch.wastagePercentage || 6.5}% down to 3.5% reclaims **${formatCurrency((eco.wastageCost || 7000) * 0.45)} per batch**.
3. **Packaging Re-Engineering**: Switch outer corrugated packaging to high-density flexible film to lower packaging expense by 12%.`;
  }

  if (query.includes('margin') || query.includes('profit')) {
    return `### 📈 Profit Margin Enhancement Roadmap

Current Margin: **${margin}%** (Target: 25-30%)

1. **Target Selling Price**: Raise unit selling price from ₹${batch.sellingPricePerUnit || 160} to **₹${Math.round((unitCost / 0.75) * 100) / 100}** to instantly achieve a 25% margin.
2. **Capacity Scale Multiplier**: Double batch size to dilute fixed plant overheads from ₹${eco.overheadCost || 10000} per batch across twice the volume.`;
  }

  return `### 🤖 Operational Diagnostic Insight

For **${name}**:
- Total Production Cost: **${formatCurrency(eco.totalProductionCost)}**
- Break-Even Selling Price: **₹${eco.breakEvenSellingPrice} / ${batch.unitOfMeasure || 'kg'}**
- Top Cost Driver: **Raw Materials (${eco.costContributions?.rawMaterialPct || 54}%)**

**Action Item**: Prioritize raw material supplier negotiations and process yield loss reduction for maximum financial leverage.`;
}
