// Seeds the Supabase project from the local example recipes and images.
// Run with:  npm run seed:supabase   (reads .env.local via --env-file)
// Requires SUPABASE_URL and SUPABASE_SECRET_KEY; the secret key bypasses row
// level security so it can write rows and upload to the public bucket.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { exampleRecipes } from '../src/data/exampleRecipes.ts';
import {
  RECIPE_IMAGE_BUCKET,
  RECIPES_TABLE,
} from '../src/constants/supabase.ts';

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  console.error(
    'Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local, then run: npm run seed:supabase',
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const slugs = new Set();

for (const recipe of exampleRecipes) {
  const { slug } = recipe;
  if (slugs.has(slug)) {
    throw new Error(
      `Duplicate slug "${slug}"; fixture slugs must be distinct.`,
    );
  }
  slugs.add(slug);

  const extension = path.extname(recipe.pictureUrl).toLowerCase();
  const objectPath = `recipes/${slug}${extension}`;
  const image = await readFile(path.join('public', recipe.pictureUrl));
  const { error: uploadError } = await supabase.storage
    .from(RECIPE_IMAGE_BUCKET)
    .upload(objectPath, image, {
      contentType: CONTENT_TYPES[extension] ?? 'application/octet-stream',
      upsert: true,
    });
  if (uploadError) {
    throw new Error(`Image upload failed for ${slug}: ${uploadError.message}`);
  }

  const row = {
    slug,
    name: recipe.name,
    description: recipe.description,
    tags: recipe.tags,
    source: recipe.source,
    language: recipe.language,
    total_time_minutes: recipe.totalTime,
    yield_servings: recipe.yieldServings,
    equipments: recipe.equipments,
    cuisine: recipe.cuisine,
    meal: recipe.meal,
    type: recipe.type,
    ingredients: recipe.ingredients,
    picture_path: objectPath,
    prep: recipe.steps.prep,
    steps: recipe.steps.steps.map((step) => ({
      detail: step.detail,
      image_path: step.imageUrl ?? null,
    })),
    credit_to: recipe.creditTo ?? null,
  };
  const { error } = await supabase
    .from(RECIPES_TABLE)
    .upsert(row, { onConflict: 'slug' });
  if (error) {
    throw new Error(`Row upsert failed for ${slug}: ${error.message}`);
  }
  console.log(`Seeded ${slug}`);
}

console.log(`Done: ${exampleRecipes.length} recipes.`);
