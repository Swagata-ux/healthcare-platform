import { Injectable } from '@nestjs/common';
import { AIRecommendationInput, AIRecommendation } from '@healthcare/common-lib';

interface RecommendationProvider {
  generateRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]>;
}

@Injectable()
export class RulesBasedProvider implements RecommendationProvider {
  async generateRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]> {
    const recommendations: AIRecommendation[] = [];

    // Simple rules-based logic
    if (input.symptoms?.includes('chest pain')) {
      recommendations.push({
        type: 'provider',
        entityId: 'cardiology-clinic-1',
        confidence: 0.9,
        reasoning: 'Chest pain symptoms suggest cardiology consultation',
      });
    }

    if (input.symptoms?.includes('fever')) {
      recommendations.push({
        type: 'service',
        entityId: 'general-consultation',
        confidence: 0.8,
        reasoning: 'Fever symptoms suggest general medical consultation',
      });
    }

    // Location-based recommendations
    if (input.location) {
      recommendations.push({
        type: 'provider',
        entityId: 'nearest-clinic',
        confidence: 0.7,
        reasoning: 'Recommended based on proximity to your location',
      });
    }

    return recommendations;
  }
}

@Injectable()
export class LLMProvider implements RecommendationProvider {
  private apiKey = process.env.LLM_API_KEY;
  private apiUrl = process.env.LLM_API_URL || 'https://api.openai.com/v1/chat/completions';

  async generateRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]> {
    if (!this.apiKey) {
      throw new Error('LLM API key not configured');
    }

    const prompt = this.buildPrompt(input);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a healthcare AI assistant. Provide medical recommendations in JSON format.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      return this.parseRecommendations(data.choices[0].message.content);
    } catch (error) {
      console.error('LLM API error:', error);
      // Fallback to rules-based
      const rulesProvider = new RulesBasedProvider();
      return rulesProvider.generateRecommendations(input);
    }
  }

  private buildPrompt(input: AIRecommendationInput): string {
    let prompt = 'Based on the following information, provide healthcare recommendations:\n';
    
    if (input.symptoms) {
      prompt += `Symptoms: ${input.symptoms.join(', ')}\n`;
    }
    
    if (input.intent) {
      prompt += `Intent: ${input.intent}\n`;
    }
    
    if (input.patientHistory) {
      prompt += `Patient History: ${input.patientHistory}\n`;
    }

    prompt += '\nProvide recommendations in JSON format with type, entityId, confidence, and reasoning fields.';
    
    return prompt;
  }

  private parseRecommendations(content: string): AIRecommendation[] {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }
}

@Injectable()
export class RecommendationService {
  private provider: RecommendationProvider;

  constructor() {
    // Switch between providers based on environment
    const providerType = process.env.AI_PROVIDER || 'rules';
    
    if (providerType === 'llm' && process.env.LLM_API_KEY) {
      this.provider = new LLMProvider();
    } else {
      this.provider = new RulesBasedProvider();
    }
  }

  async getRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]> {
    return this.provider.generateRecommendations(input);
  }

  async getProviderRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]> {
    const recommendations = await this.getRecommendations(input);
    return recommendations.filter(r => r.type === 'provider');
  }

  async getServiceRecommendations(input: AIRecommendationInput): Promise<AIRecommendation[]> {
    const recommendations = await this.getRecommendations(input);
    return recommendations.filter(r => r.type === 'service');
  }
}