import { defineType } from 'sanity'

export default defineType({
  name: 'researchArea',
  title: 'Research Area',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'description',
    },
  },
})
