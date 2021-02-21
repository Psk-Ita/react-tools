
# svg -> tsx

<!-- ABOUT -->
#### About:
this is a node module to wrap custom svg images to react-typescript component

<!-- WHY -->
#### What!!!?
yes, you are right... there are already a lot of modules to achieve the the same... but when I needed to chose one I saw:
- the initial svg to be changed
- components been generated "at run-time"
- components generated in the build

<!-- SO -->
#### So what?
this is a "batch-like" script,
it does not require any changes to build process,
when you need to re-process your svg images,

just run "node + svg-to-tsx.js" (adjust your path)

#### How does it work?
it lists all sgv images in the "ICONS_SOURCE_DIR" folder,
for each of them, the related tsx file will be generated in the "COMPONENTS_DIR" folder
(you can also update the component in order to read path as parameters, but I preferred to keep it the most linear and simple) 

<!-- AND -->
#### What is the "pro" using this module?
my idea was to have a kind of "image-factory" that depending on the input-key, it automatically renders a different image:
- the "CustomIcons" enum is automatically generated and exported as well as the list of all generates tsx modules
- the "SvgImage" method (the factory)
- it also generates a test, for each entry of the enum

##### pre-requisites
- fs, path, glob required (as dev-pedendencies)
- COMPONENTS_DIR folder should be created before running the script


### Enjoy!
