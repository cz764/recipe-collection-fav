import type { NextConfig } from 'next';
import { RECIPE_IMAGE_BUCKET } from './src/constants/supabase';

// Allow Next.js Image to optimize only this project's public recipe bucket.
const supabaseHost = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: 'https',
            hostname: supabaseHost,
            pathname: `/storage/v1/object/public/${RECIPE_IMAGE_BUCKET}/**`,
          },
        ]
      : [],
  },
};

export default nextConfig;
