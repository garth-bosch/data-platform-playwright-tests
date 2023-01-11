## Configuration

Nothing special here Refer to: [README.md](/README.md)

> **_NOTE:_**
> `cit-base` directory will be soon published as a npm module to opengov npm registry.
> The current build process is a workaround to mimic the exported module behavior.
> For that reason, everytime you introduce any new code in `/cit-base` you will need to run:

```
$ yarn cache clean && yarn nuke && yarn build
```

### Checking in code
- Make sure to run `yarn lint` before checking in any code
    - This will run Eslint + Prettier checks
- To fix prettier errors automatically, run: `yarn format`