import { api } from './api';
import { LandingCard, MockNews } from './types';

export const landingService = {
  async getLandingCards(): Promise<LandingCard[]> {
    return api.get<LandingCard[]>('/landing/cards');
  },

  async saveLandingCards(cards: LandingCard[]): Promise<void> {
    await api.post('/landing/cards', cards);
  },

  async getLandingNews(): Promise<MockNews[]> {
    return api.get<MockNews[]>('/landing/news');
  },

  async saveLandingNews(news: MockNews[]): Promise<void> {
    await api.post('/landing/news', news);
  }
};
