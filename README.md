# sitePage.js
![sitePage.js version](http://img.shields.io/badge/sitePage.js-v1.0.0-brightgreen.svg)
[![License](https://img.shields.io/badge/License-GPL-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)
[![PayPal Donate](https://img.shields.io/badge/donate-PayPal.me-ff69b4.svg)](https://www.paypal.me/pixelbyaj)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/sitepage.js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/sitepage.js)
&nbsp;&nbsp; **|**&nbsp;&nbsp; *7Kb gziped* &nbsp;&nbsp;**|**&nbsp;&nbsp; *Created by [@imac2](https://twitter.com/imac2)*

A simple and easy to use library that creates single page scrolling websites with horizontal or vertical scrolling.

- [Introduction](https://github.com/pixelbyaj/sitepage#introduction)
- [Compatibility](https://github.com/pixelbyaj/sitepage#compatibility)
- [License](https://github.com/pixelbyaj/sitepage#license)
- [Usage](https://github.com/pixelbyaj/sitepage#usage)
  - [Creating links to sections or slides](https://github.com/pixelbyaj/sitepage#creating-links-to-sections-or-slides)
  - [Creating smaller or bigger sections](https://github.com/pixelbyaj/sitepage#creating-smaller-or-bigger-sections)
  - [State classes added by sitepage](https://github.com/pixelbyaj/sitepage#state-classes-added-by-fullpagejs)
  - [Lazy loading](https://github.com/pixelbyaj/sitepage#lazy-loading)
  - [Auto play/pause embedded media](https://github.com/pixelbyaj/sitepage#auto-playpause-embedded-media)
  - [Use extensions](https://github.com/pixelbyaj/sitepage#use-extensions)
- [Options](https://github.com/pixelbyaj/sitepage#options)
- [Callbacks](https://github.com/pixelbyaj/sitepage#callbacks)
- [Reporting issues](https://github.com/pixelbyaj/sitepage#reporting-issues)
- [Contributing to sitepage](https://github.com/pixelbyaj/sitepage#contributing-to-fullpagejs)
- [Changelog](https://github.com/pixelbyaj/sitepage#changelog)
- [Build tasks](https://github.com/pixelbyaj/sitepage#build-tasks)
- [Resources](https://github.com/pixelbyaj/sitepage#resources)
- [Donations](https://github.com/pixelbyaj/sitepage#donations)

## Introduction
Suggestion are more than welcome, not only for feature requests but also for coding style improvements.
Let's make this a great library to make people's lives easier!

## Compatibility
sitepage is fully functional on all modern browsers, as well as some old ones such as Internet Explorer 9, Opera 12, etc.
It works with browsers with CSS3 support and with the ones which don't have it, making it ideal for old browsers compatibility.
It also provides touch support for mobile phones, tablets and touch screen computers.

## License

### Open source license
If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use sitePage under the terms of the GPLv3.

**The credit comments in the JavaScript and CSS files should be kept intact** (even after combination or minification)

## Usage
As you can see in the example files, you will need to include:
 - The JavaScript file `sitepage` (or its minified version `sitepage.min.js`)
 - The css file `sitepage.min.css`

### Install using bower or npm
**Optionally**, you can install sitepage with bower or npm if you prefer:

Terminal:
```shell
// With bower
bower install sitepage.js

// With npm
npm install sitepage.js
```

### Including files:
```html
<link rel="stylesheet" type="text/css" href="sitepage.min.css" />

<script type="text/javascript" src="sitepage.min.js"></script>
```

### Required HTML structure
Start your HTML document with the compulsory [HTML DOCTYPE declaration](http://www.corelangs.com/html/introduction/doctype.html) on the 1st line of your HTML code. You might have troubles with sections heights otherwise. The examples provided use HTML 5 doctype `<!DOCTYPE html>`.

Each section will be defined with an element containing the `section` class.
The active section by default will be the first section, which is taken as the home page.

Sections will get placed inside a wrapper (`<div id="sitepage">` in this case). The wrapper can not be the `body` element.
```html
<div id="sitePage">
	
</div>
```

You can see a fully working example of the HTML structure in the [`index.html` file](https://pixelbyaj.github.io/sitepage/).

### Initialization

#### Initialization with Vanilla Javascript
All you need to do is call sitepage before the closing `</body>` tag.

```javascript
new SitePage("sitePage", {
        //brandname
        brandName: "",
        backgroundColor:"#45b4f5",
        //sections
        sections: [{
                anchor: "Home",
                templateUrl: "./views/home.html",
                backgroundColor: "#45b4f5"
            },
            {
                anchor: "Features",
                templateUrl: "./views/features.html",
                backgroundColor: "#fc6c7c"
            },
            {
                anchor: "Examples",
                templateUrl: "./views/examples.html",
                backgroundColor: "#1bbc9b"
            },
            {
                anchor: "Contact Us",
                template: "<h1>Contact Us</h1>",
                backgroundColor: "#1bbc9b"
            }
        ],
        //navigation
        navigation: navigation,
        sameurl: sameurl,
        //transition
        easing: "ease",
        transitionSpeed: 1000,
        //scrolling
        autoScrolling: autoscrolling,
        keyboardNavigation: true,
        //callback events
        pageTransitionStart: (prevPage, currentPage) => {
            console.log(`prevPage: ${prevPage ? prevPage.id : ""} currentPage :${currentPage.id}`);
        },
        pageTransitionEnd: (currentPage) => {
            console.log(`currentPage :${currentPage.id}`);
        }
    });


```


## Donations
Donations would be more than welcome :)

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/pixelbyaj)
## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://pixelbyaj.github.io/#contact)]
