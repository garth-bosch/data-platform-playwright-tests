# Nightly Reports  
[Employee](https://psychic-disco-e8d92ac1.pages.github.io/playwright-employee-app/test-results/html/index.html)   
[Storefront](https://psychic-disco-e8d92ac1.pages.github.io/playwright-storefront-app/test-results/html/index.html)

# Pre-requisites
- nvm
- node `v16.15.0` or above
- yarn 

# Setup prerequisites and VS Code on a Mac
> **_NOTE:_**
> If you have the above pre-requisites installed, mac_setup.sh can be skipped.

> **_WARNING:_**
> If you are on Intel chip Macs, you are better off installing the pre-requisites manually.   
```
$ sh mac_setup.sh
```

# Setup projects
> **_NOTE:_** If you are setting up for the first time, run:
```
$ yarn build
```

> **_NOTE:_** 
> The `playwright-base` and `cit-base`  directory will be soon published as a npm module to opengov npm registry. 
> The current build process is a workaround to mimic the exported module behavior.
> For that reason, everytime you introduce any new code in `/playwright-base` or `/cit-base` you will need to run:

```
$ yarn cache clean && yarn nuke && yarn build
```

### Run Storefront tests
[Storefront Readme](/playwright-storefront-app/README.md)

### Run Employee App tests
[EmployeeApp Readme](/playwright-employee-app/README.md)

### Checking in code
- Make sure to run `yarn lint` before checking in any code
  - This will run Eslint + Prettier checks
- To fix prettier errors automatically, run: `yarn format`
