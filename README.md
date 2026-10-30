# Angle Quest

Grade 6 maths and science practice: a static website (plain HTML, CSS and JavaScript, no build step).

- `index.html`: maths
- `science.html`: science
- `parent.html`: parent page (needs cloud save)

## Publish on GitHub Pages

1. Create a repository and put these files at its top level (`index.html` next to this README).
2. Settings > Pages > Build and deployment: Source "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. After a minute the site is at `https://<your-user>.github.io/<repo>/`.

Progress is saved in each browser. To turn on cloud save and the parent page, follow the steps
at the top of `cloud/firebase-config.js` and add `<your-user>.github.io` to Firebase's authorized domains.

Adding lessons: see `lessons/README.md` and `science/README.md`.
