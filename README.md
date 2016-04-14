# remark-lint-appropriate-heading

> Check that the top-level heading matches the directory name

This [remark-lint](https://github.com/wooorm/remark-lint) rule was created for [standard-readme](//github.com/RichardLitt/standard-readme).

This rule checks that the top title is in the right position, and that it references the current directory name.

```Text
<!-- Invalid -->

A title on the second line

<!-- Invalid -->
# the-wrong-title


<!-- Valid -->
# appropriate-heading

```

## Using the rule

### Via `.remarkrc`

```bash
npm install -g remark
npm install -g remark-lint
npm install remark-lint-appropriate-heading # local install!
```

Then, set up your `.remarkrc`:

```JSON
{
  "plugins": {
    "remark-lint": {
      "external": ["remark-lint-appropriate-heading"]
    }
  }
}
```

Now you can use the following command to run the lint:

```bash
remark --no-stdout readme.md
```

### Via CLI

```bash
npm install -g remark
npm install -g remark-lint
npm install -g remark-lint-appropriate-heading # global install!
remark --no-stdout -u remark-lint="external:[\"remark-lint-appropriate-heading\"]" readme.md
```

Note that the `lint=<lint_options>` option only works with `remark >= 1.1.1`.

This `README.md` (and this module) is based on [this one](https://github.com/vhf/remark-lint-no-empty-sections) by [@vhf](https://github.com/vhf) (MIT).
