## What's Changed

🐛 Bug Fixes

- Missing update the useProjectStore ([751386b](../../commit/751386b))
- Button can not inside a button => set asChild to prevent this notice ([0adb651](../../commit/0adb651))

♻️ Refactoring

- Create a libruary to cache the current router ([389376f](../../commit/389376f))
- Use context to update category items, remove state ([486b1ea](../../commit/486b1ea))
- Listen changes from category and diagram ([0a46703](../../commit/0a46703))
- Move the nav html to inside DiagramList ([5eb5a1b](../../commit/5eb5a1b))
- Add loading and success status to category and project store ([4b3e496](../../commit/4b3e496))
- Load all project, category and content category + display a loading progress while loading ([efc566b](../../commit/efc566b))
- Create contentCategory store and repository ([8d3368f](../../commit/8d3368f))
- Apply sortable to category ([a874f28](../../commit/a874f28))
- Replace zustand to jotai - cuz zustand trigger re-render to all global state when calling set method ([c2d155f](../../commit/c2d155f))
- Try to display diagram by category id ([c865009](../../commit/c865009))
- Select uml diagram by category ([c378b3f](../../commit/c378b3f))
- Remove default category ([9cc2da9](../../commit/9cc2da9))
- Remove overflow from inside the diagram list. but the whole sidebar ([e986e8b](../../commit/e986e8b))
- Add dnd-kit for sorting and dragging ([6d1d5a5](../../commit/6d1d5a5))
- Decouple logic of uml diagram into small components ([bd15a7e](../../commit/bd15a7e))
- Decouple logic of category into small components ([a9eb1c1](../../commit/a9eb1c1))
- Update database, add position to uml_projects and use numeric instead of real + get max value instead of count the total record ([93bb97d](../../commit/93bb97d))

🔨 Other Changes

- Enable sorting diagram and category ([3038df5](../../commit/3038df5))
- Detect type while updating the diagram ([807fcf8](../../commit/807fcf8))
- Allow to update diagram's position ([1ba9eca](../../commit/1ba9eca))
- Create a hook to get all category and diagrams which belongs to a specified category + start replacing that hook to <CategoryDndContext/> (In progress) ([f493518](../../commit/f493518))
- Add diagram sortable context and item ([80f4e1d](../../commit/80f4e1d))
- Sort diagram by position asc ([696b599](../../commit/696b599))
- Remove redundant component ([46794a1](../../commit/46794a1))
- Remove strict mode for avoiding unexpected re-renders ([330b7a4](../../commit/330b7a4))
- Create a test section for Sortable feature ([64e7373](../../commit/64e7373))
- Add a /test page for experimenting new packages ([7f8e384](../../commit/7f8e384))
- Create Category section ([14d9a9f](../../commit/14d9a9f))
- Remove unused type ([17575a4](../../commit/17575a4))
- Bump new version ([bd23751](../../commit/bd23751))
- Skip: add a condition to skip counting the version ([617d418](../../commit/617d418))
- Skip the locked version and start counting from next commit message ([f14f25e](../../commit/f14f25e))


📋 Full Changelog: [f14f25e...3038df5](../../compare/f14f25e...3038df5)