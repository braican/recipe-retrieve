export interface Recipe {
  id: number;
  title: string;
  source_url: string;
  image_url: string;
  ingredients: string[];
  steps: string[];
}
