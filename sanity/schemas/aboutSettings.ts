import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutSettings',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionLabel',
      title: 'Section Label',
      type: 'string',
      description: 'Small uppercase text above the headline',
      initialValue: 'Background',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'Main heading for the about section',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Main paragraph describing your work',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'researchAreas',
      title: 'Research Areas',
      type: 'array',
      of: [{ type: 'researchArea' }],
      description: 'List of research focus areas with descriptions',
    }),
    defineField({
      name: 'approachTitle',
      title: 'Approach Card Title',
      type: 'string',
      description: 'Title for the approach card',
      initialValue: 'Interpretable ML',
    }),
    defineField({
      name: 'approachDescription',
      title: 'Approach Card Description',
      type: 'text',
      rows: 2,
      description: 'Description for the approach card',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Section',
        subtitle: 'Edit about section content',
      }
    },
  },
})
