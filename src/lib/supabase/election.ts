import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Election News APIs
export const electionNewsApi = {
  // Get all news with filters
  async getNews(filters?: {
    category?: string;
    party?: string;
    region?: string;
    trending?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('election_news')
      .select('*')
      .order('published_at', { ascending: false });

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    if (filters?.party) {
      query = query.eq('party', filters.party);
    }
    if (filters?.region && filters.region !== 'all') {
      query = query.eq('region', filters.region);
    }
    if (filters?.trending) {
      query = query.eq('trending', true);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Get single news by slug
  async getNewsBySlug(slug: string) {
    const { data, error } = await supabase
      .from('election_news')
      .select('*')
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  // Create news (admin)
  async createNews(newsData: any) {
    const { data, error } = await supabase
      .from('election_news')
      .insert([newsData])
      .select();
    return { data, error };
  },

  // Update news (admin)
  async updateNews(id: string, newsData: any) {
    const { data, error } = await supabase
      .from('election_news')
      .update(newsData)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Delete news (admin)
  async deleteNews(id: string) {
    const { error } = await supabase
      .from('election_news')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Increment likes
  async incrementLikes(newsId: string) {
    const { data, error } = await supabase.rpc('increment_likes', { news_id: newsId });
    return { data, error };
  },

  // Increment views
  async incrementViews(newsId: string) {
    const { data, error } = await supabase.rpc('increment_views', { news_id: newsId });
    return { data, error };
  },

  // Increment comments
  async incrementComments(newsId: string) {
    const { data, error } = await supabase.rpc('increment_comments', { news_id: newsId });
    return { data, error };
  }
};

// Poll Data APIs
export const pollApi = {
  async getActivePoll() {
    const { data, error } = await supabase
      .from('poll_data')
      .select('*')
      .eq('active', true)
      .order('percentage', { ascending: false });
    return { data, error };
  },

  async updatePoll(id: string, pollData: any) {
    const { data, error } = await supabase
      .from('poll_data')
      .update(pollData)
      .eq('id', id)
      .select();
    return { data, error };
  }
};

// Trending Topics APIs
export const trendingApi = {
  async getTrendingTopics() {
    const { data, error } = await supabase
      .from('trending_topics')
      .select('*')
      .eq('active', true)
      .order('posts', { ascending: false })
      .limit(10);
    return { data, error };
  }
};

// Upcoming Events APIs
export const eventsApi = {
  async getUpcomingEvents() {
    const { data, error } = await supabase
      .from('upcoming_events')
      .select('*')
      .eq('active', true)
      .order('event_date', { ascending: true })
      .limit(10);
    return { data, error };
  }
};

// Site Stats APIs
export const statsApi = {
  async getStats() {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .eq('id', 1)
      .single();
    return { data, error };
  },

  async updateStats(statsData: any) {
    const { data, error } = await supabase
      .from('site_stats')
      .update(statsData)
      .eq('id', 1)
      .select();
    return { data, error };
  }
};

// Subscriber APIs
export const subscriberApi = {
  async subscribe(email: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select();
    return { data, error };
  },

  async unsubscribe(email: string) {
    const { data, error } = await supabase
      .from('subscribers')
      .update({ subscribed: false })
      .eq('email', email)
      .select();
    return { data, error };
  }
};

// Image Upload API
export const imageUploadApi = {
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('election-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    return { data, error };
  },

  async getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('election-images')
      .getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteImage(path: string) {
    const { error } = await supabase.storage
      .from('election-images')
      .remove([path]);
    return { error };
  },

  async listImages() {
    const { data, error } = await supabase.storage
      .from('election-images')
      .list();
    return { data, error };
  }
};