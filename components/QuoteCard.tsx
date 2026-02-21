import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QUOTES, getDailyQuote } from '../constants/quotes';

export function QuoteCard() {
  const [quote, setQuote] = React.useState(() => getDailyQuote());

  const refreshQuote = () => {
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(random);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={refreshQuote}
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
        borderLeftWidth: 3,
        borderLeftColor: '#EC4899',
      }}
    >
      <Text style={{ fontSize: 11, color: '#EC4899', fontWeight: '600', marginBottom: 8, letterSpacing: 1 }}>
        DAILY WISDOM
      </Text>
      <Text style={{ fontSize: 15, color: '#FFFFFF', lineHeight: 22, fontStyle: 'italic', marginBottom: 8 }}>
        "{quote.quote}"
      </Text>
      <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
        — {quote.author}
      </Text>
    </TouchableOpacity>
  );
}
