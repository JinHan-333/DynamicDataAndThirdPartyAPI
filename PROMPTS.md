# Prompts used in Claude Code

1. > I am building a demo website for cocktail. The requirement is in @REQUIREMENT.md , the design is in @design/ . Now, build a plan for the
  implementation and put them in a markdown file.

2. > Please re-organize the implementation plan. Let's finish the search and displaty ingeirident function firest, then translate, then finally
  chat. You may put placeholders first. For any design component in the design that you think it needs image, please leave a place holder over
  there. Now, please update @IMPLEMENTATION_PLAN.

3. >  The APIs can be found in https://www.thecocktaildb.com/api.php We surely need the thubmails for display. Based on our expirement in @API_DOCUMENTATION, please document the usage of APIs in a way it's easier for agents to understand. Notice that when multiple result presents in the search, we only want to show the first one. 

4. >  Now, please build a todolist for the project based on @IMPLEMENTATION_PLAN. Please put the todo in a markdown file 

5. >  Please work on the phase 1 in @TODO.md . When finish, mark them as finish 

6. > I got the error?: [plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin
  has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your
  PostCSS configuration. Please avoid using postcss use and install tailwind css using vite.

7. > Now, please act as a code review agent. Please revisit phase 1 in @TODO.md .

8. > Please work on the phase 2 in @TODO.md . When finish, mark them as finish

9. [Repeat the above code - review steps for phase 2 to 5]

10. >  Please modify the @src/components/Hero.jsx . Consider the orientation of text in @design/hero_orientation.png . Please modify the structure to
  the @design/hero_orientation.png . The background is now grey, we will replace them with image 

11. > Please continue with Phase 6 in @TODO.md  to build the deep L translation feature.

12. > Please remove all backgrounds and make them grey. I will update the background image

13. > When doing translate, please translate all info from the receipt.

14. > Please use VTIE_PROXY for APIs.

16. > The thumbmails are missing. Please add them from the APIs.

17. > Update the @src/components/AIAssistant.jsx to request with chatgpt's api 

18. > the search fearture in @src/components/Hero.jsx is not working. The APIs are disconnect. Please fix them

19. > Please add a "related drink" under @src/pages/RecipePage.jsx . You should show four random receipt name with the image of the drink from
  cocktaildb.