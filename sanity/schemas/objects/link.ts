import { defineType } from 'sanity'

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
    },
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'url',
    },
  },
})
