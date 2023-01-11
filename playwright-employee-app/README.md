## Configuration
> **_NOTE:_**
> Make sure you change directory from the root project.
```
$  cd playwright-employee-app
```
> **_NOTE:_**
> There are some app secrets that you will need pull in before you can run tests.
> Follow the steps to set them up:
- Copy contents of example.env to a new env file:
```
$ cp example.env .env
```
- Grab the missing secrets from [1Password](https://opengov.1password.com/vaults/tswhs53bxau3v4gijuhoxa2rqi/allitems/gjmlyea6vlzx2i4scyufi3zl4y) and add to the .env file.

## Tests

### Run Test by test tag
```$ yarn test --grep "@OGT-34305"```

### Run Test by feature tag
`$ yarn test --grep "@payments"`

### Run Test by folder path
`$ yarn test tests/payments`

> **_NOTE:_**
> By default all tests run in headless mode.
> If you want to run to visually monitor what tests steps are being executed, append `:headed` to you test commands. E.g:
```
$ yarn "test:headed" --grep "@OGT-34305"
$ yarn "test:debug" --grep "@OGT-34305"
```

### Checking in code
- Make sure to run `yarn lint` before checking in any code
    - This will run Eslint + Prettier checks
- To fix prettier errors automatically, run: `yarn format`