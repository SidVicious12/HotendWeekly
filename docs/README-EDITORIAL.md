# HotendWeekly Editorial System

## Adding New Articles

Articles are stored in `/src/data/articles.ts`. To add a new article:

1. Add a new object to the `articles` array with these fields:
   ```typescript
   {
     title: "Your Article Title",
     slug: "url-friendly-slug",
     date: "YYYY-MM-DD", 
     author: "Author Name",
     excerpt: "Brief description for listings",
     tags: ["tag1", "tag2"],
     content: "Full article content with markdown-style formatting"
   }
   ```

2. The content supports basic markdown formatting:
   - `# Heading 1` for main headings
   - `## Heading 2` for section headings  
   - `**bold text**` for emphasis
   - `*italic text*` for styling
   - Regular paragraphs separated by double line breaks

3. Run `npm run build` to regenerate static pages

## Changing the Logo

1. **Header Logo**: Replace `/public/branding/hotendweekly-logo.svg`
   - Recommended size: 180x32px for optimal display
   - SVG format preferred for scalability

2. **Icon/Favicon**: Replace `/public/branding/hotendweekly-icon.svg`
   - Square format: 32x32px minimum
   - Used for favicon and social sharing

3. **Favicon**: The icon is automatically copied to `/public/favicon.svg`

## Future TODOs for AI Search

### Phase 1 - AI Integration
- [ ] Set up Supabase database for STL metadata
- [ ] Integrate OpenAI GPT-4 API for search processing
- [ ] Create serverless functions for API rate limiting
- [ ] Implement natural language query processing
- [ ] Add search result curation algorithms

### Phase 2 - Print Fulfillment  
- [ ] Integrate Stripe for payment processing
- [ ] Connect to Craftcloud API for print services
- [ ] Add local maker network connections
- [ ] Implement order tracking system
- [ ] Create "Get this printed" functionality

### Phase 3 - Creator Platform
- [ ] Build creator profiles and portfolios
- [ ] Add STL upload and management system
- [ ] Implement licensing and sales tools
- [ ] Create community features

## Development Notes

- **Navigation**: All pages use consistent header with logo and navigation links
- **Responsive**: Designed mobile-first with breakpoints at 768px and 1280px
- **Performance**: Static site generation for optimal loading
- **SEO**: Proper meta tags and structured content for search optimization

## Current Routes

- `/` - Homepage with hero, latest articles, and platform features
- `/editorial` - Article listing page
- `/editorial/[slug]` - Individual article pages
- `/discover` - AI search placeholder (Phase 1)
- `/tools` - Maker tools overview  
- `/newsletter` - Newsletter signup

All pages include proper navigation, footers, and responsive design.