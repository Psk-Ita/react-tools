<!-- TSX, SGV, SVG to TSX, node module ->
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

it lists all images in the "ICONS_SOURCE_DIR" folder,
for each of them, the related tsx file will be generated in the "COMPONENTS_DIR" folder
    .svg files will be kept as svg, pay attention to svg attributes, not all are propertly decoded by ts definition
    all other formats will be managed as base64 stream

to make it easily customizable, at the begin of the scripts the following variables are provided
    objName -> component and enum name
    cssClassName -> default class name
    COMPONENTS_DIR -> target directory to write components (under /src)
    ICONS_SOURCE_DIR -> source fodler containing images (outside /src)

#### What is the "pro" using this module?

my idea was to have a kind of "image-factory" that depending on the input-key, it automatically renders a different image:

- it also generates a test, for each entry of the enum

##### pre-requisites

- fs, path, glob and prettier required (as dev-pedendencies)
- COMPONENTS_DIR folder should be created before running the script

### Enjoy!
