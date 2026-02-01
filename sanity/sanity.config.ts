import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Singleton document IDs
const singletonTypes = new Set(['heroSettings', 'aboutSettings', 'siteSettings'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'saraelshawa',
  title: 'Sara El-Shawa',
  
  projectId: '7lwqqklw',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton items
            S.listItem()
              .title('Hero Settings')
              .id('heroSettings')
              .child(
                S.document()
                  .schemaType('heroSettings')
                  .documentId('heroSettings')
              ),
            S.listItem()
              .title('About Section')
              .id('aboutSettings')
              .child(
                S.document()
                  .schemaType('aboutSettings')
                  .documentId('aboutSettings')
              ),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            // Regular document lists
            S.documentTypeListItem('post').title('Posts'),
            S.documentTypeListItem('newsItem').title('News / Milestones'),
            S.documentTypeListItem('affiliation').title('Affiliations'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Filter out singleton types from the global "New document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
