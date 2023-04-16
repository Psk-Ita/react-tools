<!-- TSX, SGV, SVG to TSX, node module ->
# svg -> tsx

<!-- ABOUT -->

#### About:

this is a node module to handle images as react-typescript component

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
when you need to re-process your images,

just run `npm run image-lib` -> for static loaded images

or run `npm run image-lib-lazy` -> for lazy loaded images

#### How does it work?

it lists all images in the "ICONS_SOURCE_DIR" folder,
for each of them, the related tsx file will be generated in the "COMPONENTS_DIR" folder
> .svg files will be kept as svg (pay attention to svg attributes, not all are propertly decoded by ts definition) 
> all other formats will be managed as base64 stream

to make it easily customizable, at the begin of the scripts the following variables are provided

    `objName` -> component and enum name

    `cssClassName` -> default class name

    `COMPONENTS_DIR` -> target directory to write components (under /src)

    `ICONS_SOURCE_DIR` -> source fodler containing images (outside /src)

#### What is the "pro" using this module?
- performances: browser does not require any external images at runtime, all channels could be dedicated to api
- security: no images will be published, no-one else could stolen you images

#### cons
- build size increase
    - consider to assetize only icons and other small images 
    - always prefer svg when possible

##### pre-requisites

- fs, path, glob and prettier (as dev-pedendencies)
- COMPONENTS_DIR folder should be created before running the script

#### sample images
I included some images for testing purpose, some just googling "image-extention sample image"

svg resources are extracted from "free-http-error-images" asset from <a href="https://www.drlinkcheck.com/blog/free-http-error-images">Dr. Link Check</a>

### Enjoy!
