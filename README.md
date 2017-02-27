# remark-lint-appropriate-heading

> Check that the top-level heading matches the directory name

This [remark-lint](https://github.com/wooorm/remark-lint) rule was created for [standard-readme](//github.com/RichardLitt/standard-readme).

This rule checks that the top title is in the right position, and that it references the current directory name.

Invalid, `~/example/a.md`:

```markdown
Paragraph

# Example
```

Invalid, `~/example/b.md`:

```markdown
Paragraph
```

Invalid, `~/example/c.md`:

```markdown
# Not “Example”
```

Valid, `~/example/d.md`:

```markdown
# Example
```

## Using the rule

### Via `.remarkrc`

```bash
npm install -g remark-cli
npm install remark-lint remark-lint-appropriate-heading
```

Then, set up your `.remarkrc`:

```JSON
{
  "plugins": [
    "lint",
    "lint-appropriate-heading"
  ]
}
```

Now you can use the following command to run the lint:

```bash
remark readme.md
```

### Via CLI

```bash
npm install -g remark-cli
npm install remark-lint remark-lint-appropriate-heading
remark -u lint -u lint-appropriate-heading readme.md
```
