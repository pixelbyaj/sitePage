# sitePage.js
[![sitePage.js version](https://img.shields.io/npm/v/sitepage.js/latest)](https://www.npmjs.com/package/sitepage.js)
[![Known Vulnerabilities](https://snyk.io/test/github/pixelbyaj/sitePage/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pixelbyaj/sitePage?targetFile=package.json)
[![npm](https://img.shields.io/npm/dt/sitepage.js.svg)](https://www.npmjs.com/package/sitepage.js)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://mit-license.org/)
[![PayPal Donate](https://img.shields.io/badge/donate-PayPal.me-ff69b4.svg)](https://www.paypal.me/pixelbyaj)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/sitepage.js/badge/day?style=rounded)](https://www.jsdelivr.com/package/npm/sitepage.js)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/sitepage.js/badge?style=rounded)](https://www.jsdelivr.com/package/npm/sitepage.js)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/sitepage.js/badge/year?style=rounded)](https://www.jsdelivr.com/package/npm/sitepage.js)

A simple and easy to use library that creates single page scrolling websites with horizontal or vertical scrolling.
- [DEMO](http://pixelbyaj.github.io/sitepage)
- [StackBlitz](https://stackblitz.com/edit/sitepagejs)
- [Introduction](https://github.com/pixelbyaj/sitepage#introduction)
- [Compatibility](https://github.com/pixelbyaj/sitepage#compatibility)
- [License](https://github.com/pixelbyaj/sitepage#license)
- [Usage](https://github.com/pixelbyaj/sitepage#usage)
- [Options](https://github.com/pixelbyaj/sitepage#options)
- [Reporting issues](https://github.com/pixelbyaj/sitepage#reporting-issues)
- [Contributing to sitepage](https://github.com/pixelbyaj/sitepage#contributing-to-sitepagejs)
- [Changelog](https://github.com/pixelbyaj/sitepage#changelog)
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
If you are creating an open source application under a license compatible with the [MIT](https://mit-license.org/), you may use sitePage under the terms of the MIT.

**The credit comments in the JavaScript and CSS files should be kept intact** (even after combination or minification)

## Usage
As you can see in the example files, you will need to include:
 - The JavaScript file `sitepage` (or its minified version `sitepage.min.js`)
 - The css file `https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css`
 - The css file `sitepage.min.css`

### Install using  npm
**Optionally**, you can install sitepage with bower or npm if you prefer:

Terminal:
```shell
// With npm
npm install sitepage.js
```

### Including files:
```html
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href="sitepage.min.css" />

<script type="text/javascript" src="sitepage.min.js"></script>
```
### Optional use of CDN
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sitepage.js@3.0.3/dist/sitepage.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sitepage.js@3.0.3/dist/style/sitepage.min.css" />
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
        brandLogoUrl:"",//
        backgroundColor:"#45b4f5",
        verticalAlignMiddle: true, // By default it would be true	
        //sections
        sections: [{
                anchor: "Home",
                template: "<h1>Home</h1>",
                backgroundColor: "#45b4f5",
            },
            {
                anchor: "Features",
                templateId: "feature",
                backgroundColor: "#fc6c7c"
            },
            {
                anchor: "Contact Us",
                template: "<h1>Contact Us</h1>",
                backgroundColor: "#1bbc9b"
            }
        ],
        //navigation
	    anchors:true,//true|false
        navigation: 'horizontal',//horizontal|vertical
        sameurl: true,//true|false
        hamburger:true,//true|{lineColor:"",backgroundColor:"",closeOnNavigation:true}
        //transition
        easing: "ease",//ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)
        transitionSpeed: 1000,//speed in ms
        //scrolling
        autoScrolling: true,//true|false
        keyboardNavigation: true,//true|false
        //callback events
        pageTransitionStart: (prevPage, currentPage) => {
            console.log(`prevPage: ${prevPage ? prevPage.id : ""} currentPage :${currentPage.id}`);
        },
        pageTransitionEnd: (currentPage) => {
            console.log(`currentPage :${currentPage.id}`);
        }
    });


```
### Options
#### General

* brandName: Logo Title of the website.**This Option is optional**
```javascript
 brandName: "Logo Title",
```  
* backgroundColor: background color of the website. **This Option is optional** If you don't want to give background color for every section you can mention backgroundColor.
```javascript
 backgroundColor: "#ffffff",
``` 
* verticalAlignMiddle: By Default it is true and apply to all the sections. It will align the content vertically.
```javascript
 verticalAlignMiddle: false,
```
#### Navigation
* anchors: Set true|false. If you require a menu set it as a true (By defaul it is true) and if not require set it as false.
* sameurl: Set true|false. While navigating the url will change
        navigation: 'vertical',//horizontal|vertical
        hamburger: {
            lineColor: "",//line color of hamburger
            backgroundColor: "",//background color when hamburger open,
            closeOnNavigation:true//default true
        },
* Hamburger: Set true or below properties
    {
        lineColor:"",
        backgroundColor:"",
        closeOnNavigation:true
    }
#### Sections
```javascript
    sections: [{
                active:true,//set active|false
                anchor: "string",//link name
                templateId:"string"//Id of the template element which to be render
                templateUrl: "stringUrl",//use template or templateUrl
                template:"string",//use template or templateUrl
                backgroundColor: "string",
                verticalAlignMiddle:boolean,//By default it would be false, true|false
                sectionClass:"class1,class2"//comma separated string or string array class to be apply on sections 
                anchorClass:"class1,class2"//comma separated string or string array class to be apply on sections 
            }
        ],
```
#### Transition
```javascript
        easing: "string",//ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n)
        transitionSpeed: 1000,//speed in ms
```
#### Scrolling
```javascript
        autoScrolling: boolean,//By default it would be false, true|false
        keyboardNavigation: boolean,//By default it would be false, true|false
```
#### Callback Events
```javascript
    pageTransitionStart: (prevPage:HtmlElement, currentPage:HtmlElement) => {
    }
    pageTransitionEnd: (currentPage:HtmlElement) => {
    }
```
### Public API
with sitePage 3.0.0 new API has been exposed to have more control on sitepage.js
* gotoPage(pageId: string);
* navigateToNextPage();
* navigateToPrevPage();
* getMenuItems();
* getActiveSection();
```javascript
        //for example
        var sitePage = new SitePage(id,options);
        sitePage.api.gotoPage('page3'); 
        sitePage.api.navigateToNextPage();
        sitePage.api.navigateToPrevPage();
        sitePage.api.getMenuItems();
        sitePage.api.getActivePage();
```
## Reporting issues
## Contributing to sitepage
## Changelog
To see the list of recent changes, see [Releases section](https://github.com/pixelbyaj/sitePage/releases).
## Resources
## Donations
Donations would be more than welcome :)

[![Donate](https://www.paypalobjects.com/en_US/GB/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/pixelbyaj)
## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://pixelbyaj.github.io/#contact)]
