export interface HeroSlider {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  image_url: string;
}

export interface Feature {
  icon: string;
  title: string;
  subtitle: string;
  icon_url: string;
}

export interface HomepageData {
  hero_sliders: HeroSlider[];
  hero_top_right_image: string;
  hero_top_right_title: string;
  hero_top_right_subtitle: string;
  hero_top_right_price: number;
  hero_top_right_link: string;
  hero_bottom_right_image: string;
  hero_bottom_right_title: string;
  hero_bottom_right_subtitle: string;
  hero_bottom_right_price: number;
  hero_bottom_right_link: string;
  features: Feature[];
  hero_top_right_image_url: string;
  hero_bottom_right_image_url: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  og_image_url?: string;
}

export interface HomepageResponse {
  success: boolean;
  data: HomepageData;
}
