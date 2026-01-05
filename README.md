I designed and implemented this website, that shows my favorite collection of recipes. The goal of this website is to create a basic CRUD feature of recipes. Mostly get recipes and store recipes, it's ad free, concise, and just recipes no more stories. Therefore we can have a central source of truth place to find our favorite recipes, frustration-free!

## Release Note

### 0.0.1

The first minor release, proof of concept of this website. Home landing page display with json mock data. To demonstrate this could work. Features include:

- Show top section of today's recipe inspirations, it will rotate every day.
- Each recipe card will show recipe name, description, and up to 3 tags.
- Able to browse all recipes in the recipe display section.
- Search recipe will match recipe name, description, tags, cuisine, ingredients, and equipments.
- Quickly select up to 3 categories, these are most popular recipes on tags, cuisine and type.
- Open filters to further filter recipe you wanted.
- Add recipe button will lead to /add page. Which is yet to be implemented.
- Show total amount of recipes, based on all search and filter results.
- Responsive design that is tablet and mobile friendly.
- Preview: ![localhostScreenshot](https://github.com/cz764/recipe-collection-fav/blob/main/public/localhostScreenshot.jpg?raw=true)

### Planned Future Milestones

- Filter feature fully functional. (WIP)
- Recipe details page.
- Add recipe page.
- Migrate recipes from local to real database.
- Data migration of real recipes.
- User authentication.
- Delete recipe.

## Development Setup

After you cloned this code base. Run:

```bash
npm install

```

After all dependencies installed, you can start the localhost. Run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deployment

This website is deployed to: TBD.
