import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Send,
  User,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  Calculator,
  MessageSquare,
  Loader2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const FINANCIAL_KEYWORDS = [
  'invest', 'mutual fund', 'stock', 'share', 'tax', 'gst', 'savings', 'fd', 'rd',
  'interest', 'portfolio', 'return', 'nifty', 'sensex', 'gold', 'silver', 'market',
  'capital', 'gain', 'loss', 'dividend', 'bond', 'insurance', 'pension', 'retirement',
  'budget', 'expense', 'income', 'salary', 'deduction', '80c', '80d', 'section',
  'emi', 'loan', 'credit', 'debit', 'bank', 'account', 'balance', 'transaction',
  'profit', 'loss', 'asset', 'liability', 'equity', 'debt', 'fund', 'sip', 'nps',
  'epf', 'ppf', 'huf', 'tds', 'itr', 'gstr', 'bill', 'payment', 'upi', 'money',
  'rupee', 'inr', 'financial', 'finance', 'wealth', 'rich', 'poor', 'afford',
  'spend', 'save', 'earn', 'price', 'rate', 'cost', 'fee', 'charge', 'how much',
  'calculate', 'invest', 'advice', 'suggest', 'recommend', 'best', 'compare'
];

const isFinancialQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return FINANCIAL_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
};

// Simulated AI responses for financial queries
const getFinancialResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('mutual fund') || lowerQuery.includes('sip')) {
    return `**Mutual Fund Investment Advice:**

Based on current market conditions, here are my recommendations:

📊 **For Beginners (Low Risk):**
- Index Funds tracking Nifty 50 (Expense ratio < 0.5%)
- Liquid Funds for emergency corpus

📈 **For Moderate Risk:**
- Large Cap Funds (e.g., Axis Bluechip, Mirae Asset Large Cap)
- Balanced Advantage Funds for automatic equity-debt allocation

🚀 **For Aggressive Investors:**
- Mid Cap & Small Cap funds (higher volatility, higher returns)
- Sectoral funds if you understand specific industries

**SIP Strategy:** Start with ₹5,000/month minimum, increase by 10% annually. Consider tax-saving ELSS funds for 80C benefits.`;
  }

  if (lowerQuery.includes('tax') || lowerQuery.includes('80c') || lowerQuery.includes('deduction')) {
    return `**Tax Saving Strategies for FY 2024-25:**

📋 **Section 80C (₹1.5 Lakh limit):**
- ELSS Mutual Funds (3-year lock-in, equity exposure)
- PPF (15-year lock-in, risk-free 7.1% returns)
- Life Insurance Premium, NSC, Tax Saver FD

🏥 **Section 80D (Health Insurance):**
- Self & Family: ₹25,000
- Parents (60+): Additional ₹50,000

🏠 **Home Loan Benefits:**
- 80C: Principal up to ₹1.5L
- 24(b): Interest up to ₹2L

💡 **Pro Tip:** New Tax Regime has no deductions but lower rates. Calculate both to see which benefits you more.`;
  }

  if (lowerQuery.includes('stock') || lowerQuery.includes('share') || lowerQuery.includes('market')) {
    return `**Stock Market Insights:**

📊 **Current Market Overview:**
- Nifty 50 is showing bullish momentum
- Banking sector looks strong with credit growth
- IT sector facing headwinds due to global slowdown

**Investment Tips:**
1. Diversify across sectors - don't put all eggs in one basket
2. Consider blue-chip stocks for stability (Reliance, TCS, HDFC Bank)
3. Keep 20% in cash for buying opportunities during dips

⚠️ **Risk Management:**
- Never invest borrowed money
- Use stop-losses to limit downside
- Long-term SIP in index funds beats most active strategies`;
  }

  if (lowerQuery.includes('fd') || lowerQuery.includes('rd') || lowerQuery.includes('fixed deposit')) {
    return `**Fixed Deposit & Recurring Deposit Guide:**

🏦 **Current Best FD Rates (2025):**
- SBI: 7.10% (1-2 years)
- HDFC: 7.25% (15 months)
- ICICI: 7.20% (1 year)
- Small Finance Banks: Up to 9%

📈 **RD Benefits:**
- Good for regular savings discipline
- Better than savings account interest
- Premature withdrawal possible with penalty

💡 **Tax Tip:** Interest above ₹40,000 (₹50,000 for seniors) is taxable. Consider tax-saver FDs with 5-year lock-in for 80C benefits.`;
  }

  // Default financial advice
  return `**Financial Advisory:**

I can help you with:
- 📊 Mutual Fund & SIP recommendations
- 💰 Tax planning and deductions (80C, 80D)
- 📈 Stock market analysis
- 🏦 FD/RD comparisons
- 🎯 Goal-based investing
- 📋 GST and compliance queries

What specific financial topic would you like to explore? I can provide detailed insights on investments, tax savings, or help you plan for goals like retirement, child education, or buying a home.`;
};

const AIAssistant = () => {
  const { addAdminRequest } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hello! I'm **Taxora AI**, your personal financial advisor.

I can help you with:
- Investment advice (Mutual Funds, Stocks, FD/RD)
- Tax planning and deductions
- GST compliance queries
- Financial goal planning

**Note:** I only answer finance-related questions to ensure focused, quality advice.

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    let response: string;

    if (isFinancialQuery(query)) {
      response = getFinancialResponse(query);
    } else {
      response = `⚠️ **Non-Financial Query Detected**

I apologize, but I'm specifically designed to help with financial matters only. This helps me provide you with focused, high-quality advice.

Please ask me about:
- 💰 Investments (Mutual Funds, Stocks, FD/RD)
- 📋 Tax planning and GST
- 🎯 Financial goals
- 📊 Market analysis

If you need help with something outside my expertise, please use the **"Request Admin"** button below.`;
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleRequestAdmin = () => {
    addAdminRequest(`User needs assistance beyond AI capabilities. Last query: "${messages[messages.length - 1]?.content || 'N/A'}"`);
    toast({
      title: 'Request Sent',
      description: 'An admin will review your request and get back to you soon.',
    });
  };

  const quickPrompts = [
    { icon: TrendingUp, text: 'Best mutual funds to invest?' },
    { icon: Calculator, text: 'How to save tax under 80C?' },
    { icon: PiggyBank, text: 'Compare FD rates 2025' },
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Financial Assistant
          </h2>
          <p className="text-muted-foreground">Powered by Gemini • Finance queries only</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Bot className="w-3 h-3 mr-1" />
          Finance Expert
        </Badge>
      </div>

      {/* Chat Area */}
      <Card className="glass-card flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50'
                }`}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} className="font-bold">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('- ') || line.startsWith('• ')) {
                      return <p key={i} className="ml-4">{line}</p>;
                    }
                    return <p key={i} className={line ? '' : 'h-2'}>{line}</p>;
                  })}
                </div>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => setInput(prompt.text)}
                >
                  <prompt.icon className="w-3 h-3 mr-1" />
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about investments, taxes, or financial planning..."
              className="input-premium flex-1"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} className="btn-premium" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              This AI only answers financial queries
            </p>
            <Button size="sm" variant="ghost" onClick={handleRequestAdmin}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Request Admin Help
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
