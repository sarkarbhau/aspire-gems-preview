import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemaTypes/index';

export default defineConfig({
  name: 'default',
  title: 'Aspire Gems Content Console',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '3u0i5ljy',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: {types: schemaTypes}
});
