# Pull Request Review Checklist

## Creating the PR

- [ ] Described how to test the PR: urls, environment variables and other needs.
- [ ] Linked to PR on Asana task with #[PR-number].
- [ ] Pulled the target branch into the PR branch. Fixed any conflicts that might appear.
- [ ] Added screenshots of the new behavior, if applicable.
- [ ] Add a description including the context and the chosen implementation strategy.
- [ ] Explain code lines which the reviewer might not understand correctly:
  - *Don't do it in the description, do it in the code itself as comments.*
  - *Consider refactoring and changing variable/function/method names to make it clearer.*
- [ ] Deploy to review application
- [ ] Email new env vars to team

## PR Self Review Checklist

- [ ] Code is following code [style guidelines](https://github.com/Akkadu/Akkadu_WebApp/tree/master/docs/styleguide/styleguide.md)
- [ ] No bad naming: make sure you would understand your code if you read it a few months from now.
- [ ] My code is KISS: Keepin it simple, sweetheart <3
- [ ] My code is DRY: Don't Repeat Yourself.
- [ ] YAGNI: You aren't gonna need it: check that you are not overcomplicating something for the sake of 'making it future-proof'.
- [ ] No architecture errors: could there be a better separation of concerns or are there any leaky abstractions?
- [ ] My code is self-explanatory (or there are comments explaining why not)
- [ ] Bundle size is appropriate
- [ ] My features have tests
- [ ] My functions have JSDoc comments

## Responding to Feedback

- [ ] Respond to the reviewer's comments ASAP:
  - *Be grateful for the reviewer's suggestions. ("Good call. I'll make that change.").*
  - *Don't take it personally. The review is of the code, not yourself, and they'll expect the same from you.*
  - *Try to understand the reviewer's perspective.*
- [ ] Once you receive feedback and address all issues, merge and close the PR/branch.