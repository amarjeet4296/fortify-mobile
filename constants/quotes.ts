export interface Quote {
  quote: string;
  author: string;
  category: string;
}

export const QUOTES: Quote[] = [
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln", category: "discipline" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "motivation" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "motivation" },
  { quote: "Every day is a new beginning. Take a deep breath, smile, and start again.", author: "Unknown", category: "renewal" },
  { quote: "Self-control is the chief element in self-respect.", author: "Thucydides", category: "discipline" },
  { quote: "The first and best victory is to conquer self.", author: "Plato", category: "discipline" },
  { quote: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Gandhi", category: "strength" },
  { quote: "You are stronger than you think.", author: "Unknown", category: "motivation" },
  { quote: "The pain you feel today is the strength you feel tomorrow.", author: "Unknown", category: "resilience" },
  { quote: "A moment of patience saves a hundred moments of regret.", author: "Unknown", category: "discipline" },
  { quote: "Champions are made from something deep inside them.", author: "Muhammad Ali", category: "strength" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "perseverance" },
  { quote: "The mind is everything. What you think, you become.", author: "Buddha", category: "mindset" },
  { quote: "Do not pray for an easy life; pray for the strength to endure a difficult one.", author: "Bruce Lee", category: "strength" },
  { quote: "Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu", category: "discipline" },
  { quote: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee", category: "focus" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
  { quote: "It's not who you are that holds you back, it's who you think you're not.", author: "Unknown", category: "mindset" },
  { quote: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles Swindoll", category: "mindset" },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "perseverance" },
  { quote: "The greatest victory requires no battle.", author: "Sun Tzu", category: "discipline" },
  { quote: "Be so busy improving yourself that you have no time to criticize others.", author: "Unknown", category: "growth" },
  { quote: "Your greatest self has been waiting your whole life.", author: "Unknown", category: "motivation" },
  { quote: "Every struggle shapes you into who you are today.", author: "Unknown", category: "resilience" },
  { quote: "Fall down seven times, stand up eight.", author: "Japanese Proverb", category: "resilience" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "discipline" },
  { quote: "The only limits are the ones you accept.", author: "Unknown", category: "mindset" },
  { quote: "One day at a time. This is enough.", author: "Unknown", category: "renewal" },
  { quote: "Your future self is watching you right now through your memories.", author: "Unknown", category: "mindset" },
  { quote: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: "growth" },
];

export function getDailyQuote(date?: string): Quote {
  const d = date || new Date().toISOString().split('T')[0];
  const dayNum = d.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return QUOTES[dayNum % QUOTES.length];
}
