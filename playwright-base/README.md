## Configuration

Nothing special here Refer to: [README.md](/README.md)

> **_NOTE:_**
> `playwright-base` directory will be soon published as a npm module to opengov npm registry.
> The current build process is a workaround to mimic the exported module behavior.
> For that reason, everytime you introduce any new code in `/playwright-base` you will need to run:

```
$ yarn cache clean && yarn nuke && yarn build
```

### Checking in code
- Make sure to run `yarn lint` before checking in any code
    - This will run Eslint + Prettier checks
- To fix prettier errors automatically, run: `yarn format`




Example 1:
Intent: Do they want us  to optimize existing code or write test cases. If we do that we can as well work on that but raise the dates for 2 3 More months
https://github.com/OpenGov/cit-playwright-tests/pull/158#discussion_r986781864


So there are 2 primary points here.
1. API based setups should happen before browser base interactions.
* No question, this is a standard that has been set and reiterated  
2. Update "proceedToRecordByUrl" to support multiple
* Suggested enhancement to simplify the code, this is not required to get the PR through


Example 2: Outright trouble ..
what are the overall standards ?
https://github.com/OpenGov/cit-playwright-tests/pull/158#discussion_r986775810
He is asking to move to test case. But there is plenty where people have written, including functions where troy himself has handled a few things and merged to master

Our standard is to only add validations to the POM if the validation is going to be run across multiple tests - adding POM based validations should be the exception
I agree that this can be clearer.


Example 3: Can be done in many ways. Is there a documented standard ?
But
https://github.com/OpenGov/cit-playwright-tests/pull/155#discussion_r986801932
This is to refresh the page and to make sure flakiness is less

This one I want to push back one.
This is basic stuff.
1. Add a code comment if there is a reason you are doing something weird 
   * This is just best development
2. Using the goto just make it more confusing
   * Reload is a stanard part of Playwright, which would be much clearer



Example 4:
He is saying 4-5 lines of action is complex .. I've resolved that in the current PR they can find it if they need.. He gave some still gave some explanation about complexity ..
There are many more functions with more lines ..

Without a specific example it is hard to test
