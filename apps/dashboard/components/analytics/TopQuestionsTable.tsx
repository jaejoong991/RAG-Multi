const topQuestions = [
  { rank: 1, question: "What is your return policy?", count: 234 },
  { rank: 2, question: "How do I reset my password?", count: 189 },
  { rank: 3, question: "Where is my order tracked?", count: 156 },
  { rank: 4, question: "What are the shipping costs?", count: 112 },
  { rank: 5, question: "How to contact support?", count: 89 },
];

export function TopQuestionsTable() {
  return (
    <div className="space-y-4">
      {topQuestions.map((item) => (
        <div key={item.rank} className="flex items-center justify-between p-3 bg-white/2 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 flex items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
              {item.rank}
            </span>
            <p className="text-xs font-medium text-white truncate max-w-[200px]">
              {item.question}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-[10px] font-bold text-on-surface-variant uppercase">
            {item.count} queries
          </span>
        </div>
      ))}
    </div>
  );
}
