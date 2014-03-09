GhostThemeStarter
=================

Ghost Theme Starter is a repo to make it easy to get start creating a new theme for the Ghost blogging platform.

## Table of Content

- [Installation](#installation)
- [Tools](#tools)
- [CSS](#css)
- [Dependendices](#dependencies)
- [Documentation](#documentaiton)
- [Copyright and License](#copyright-and-license)

## Installation

Clone the repository from:

    git clone https://github.com/jernejcic/GhostThemeStarter.git

Then install the dependencies using:

    npm install
    bower install
    grunt init


## Tools

When in development you use the following command to build your CSS. It will initiate a service to watch for changes SCSS files and automatically recompile them for you.

    grunt server

When you read to build your theme for distribution, run the following command. It will compress your CSS files for you.

    grunt build

When creating a new project, you can run this command to create your custom SCSS files:

    grunt init

To manually build your CSS in expanded formatting use:

    grunt sass:dev

To manually build your CSS files in compressed format use:

    grunt sass:dist

## CSS

The CSS files are built in "expanded" mode during development and are compressed when built using `grunt build`.

### screen.scss

This file should not be edited when making a theme. Instead put your CSS in screen.custom.scss.

Built as `screen.css`.

This is the main CSS file used on the front it. It links to the other SCSS files to build the master CSS file for the front-end.

### post.scss

This file should not be edited when making a theme. Instead put your CSS in the `post.custom.scss`.

Built as `post.css`.

This file should not be linked to in the theme. It is pulled into the `screen.css` file during compilation.

This file should contain all styling directly related to how text inside of a post will look on the page. Ghost currently has plans to allow dynamic styling in the post editor and will use this file.

### SCSS Compilation Errors

If you get an error when you first try to compile the SCSS, make sure that you created the following files:

- theme/assets/css/screen.custom.scss
- theme/assets/css/post.custom.scss

## Dependencies

### Node

- grunt
- grunt-contrib-cssmin
- grunt-contrib-sass
- grunt-contrib-uglify
- grunt-contrib-watch

### Bower

- bootstrap-sass
- modernizr

## Documentation

For more details on creating Ghost themes, you can find the official documentation at [http://docs.ghost.org/themes/](http://docs.ghost.org/themes/).

## Copyright and License

Released under the [MIT license](LICENSE).
