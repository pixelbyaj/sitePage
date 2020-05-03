
/*!
 * sitePage.js - v2.0.2-beta
 * https://github.com/pixelbyaj/SitePage
 * @author Abhishek Joshi
 * @license MIT
 */
class SitePage {
    //#region Private Variables
    private scrollWay = Scroll.Vertical;
    private _scrollings: any[] = [];
    private _lastScrollCount = 0;
    private _sectionIds: string[] = [];
    private _activePageIndex: number;
    private _activeSection: HTMLElement;
    private pageIndex: number = 0;
    private canScroll = true;
    private scrollerTime: any;
    //#endregion
    constructor(id: string, options: IOptions) {

        if (!id) {
            throw "Page element not found";
        }
        let $ = document;
        let $e: any = $.getElementById(id);
        if (!$e) {
            throw "Page element not found";
        }


        const DEFAULT = {
            BACKGROUNDCOLOR: "#fc6c7c",
            MENUID: "sp-menu",
            NAVIGATION: "vertical",
            EASING: "ease",
            SAMEURL: true,
            AUTOSCROLLING: true,
            ANCHORS: true,
            VERTICALALIGNMIDDLE: true,
            KEYBOARDNAVIGATION: true,
            SCROLLBAR: false,
            TRANSITIONSPEED: 1000
        }
        let _options: IOptions = {
            brandName: "",
            brandLogoUrl: "",
            backgroundColor: DEFAULT.BACKGROUNDCOLOR,
            anchors: DEFAULT.ANCHORS,
            menuId: DEFAULT.MENUID,
            verticalAlignMiddle: DEFAULT.VERTICALALIGNMIDDLE,
            sections: [],
            navigation: DEFAULT.NAVIGATION,
            hamburger: null,
            autoScrolling: DEFAULT.AUTOSCROLLING,
            keyboardNavigation: DEFAULT.KEYBOARDNAVIGATION,
            scrollbar: DEFAULT.SCROLLBAR,
            transitionSpeed: DEFAULT.TRANSITIONSPEED,
            easing: DEFAULT.EASING,
            sameurl: DEFAULT.SAMEURL,
            pageTransitionStart: (prevPage: HTMLElement, currentPage: HTMLElement) => { },
            pageTransitionEnd: (currentPage: HTMLElement) => { },
        };

        if (options) {
            _options = { ..._options, ...options };
        }



        //#region private methods

        //#region Html Utility Methods
        const htmlUtility = {
            setInitialStyle: () => {
                $e.style.transform = `translate3d(0px, 0px, 0px)`;
                $e.classList.add("sp-wrapper");
                $.querySelector("body").style.backgroundColor = _options.backgroundColor;
            },
            setSectionClass: (element: any) => {
                element.classList.add("sp-section");
            },
            setSectionHeight: (element: any) => {
                element.style.height = window.innerHeight + "px";
            },
            setSectionHorizontal: (element: any) => {
                element.style.width = (this._sectionIds.length * 100) + "%";
                element.classList.add("sp-floatLeft");
                element.querySelectorAll(".section").forEach((e: any) => {
                    e.classList.add("sp-floatLeft");
                    e.style.width = (100 / this._sectionIds.length) + "%";

                });
            },
            getCellElement: (classList: string[], verticalAlignMiddle: Boolean): any => {
                var cellDiv = $.createElement("div");
                cellDiv.setAttribute("class", "sp-cell");
                if (_options.verticalAlignMiddle) {
                    if (verticalAlignMiddle === undefined || verticalAlignMiddle)
                        classList.push(...["align-middle", "text-center"]);
                }
                if (classList) {
                    cellDiv.classList.add(...classList);
                }
                htmlUtility.setSectionHeight(cellDiv);
                return cellDiv;
            },
            setBackgroundColor: (element: any, color: any) => {
                element.style.backgroundColor = color;
            },
            setBrandName: (classList: string[], brandName: string, brandLogoUrl: string): HTMLElement => {
                let navSpan = $.createElement("span");
                navSpan.classList.add(...classList);
                let brandNode: any;
                if (brandName) {
                    brandNode = $.createTextNode(brandName);
                    navSpan.appendChild(brandNode);
                } else {
                    brandNode = $.createElement("img");
                    brandNode.setAttribute("src", brandLogoUrl);
                    navSpan.appendChild(brandNode);
                }

                return navSpan;
            },
            setNavigationLink: (classList: string[], anchor: string, anchorId: string): HTMLElement => {
                let navLi = $.createElement("li");
                navLi.classList.add("nav-item");

                let navA = $.createElement("a");
                navA.classList.add(...classList);
                navA.removeEventListener("click", eventListners.navigationClick);
                navA.setAttribute("href", "javascript:void(0)");
                navA.setAttribute("data-href", anchorId);
                navA.addEventListener("click", eventListners.navigationClick);


                let textNode = $.createTextNode(anchor);
                navA.appendChild(textNode);

                navLi.appendChild(navA);
                return navLi;
            },
            setHamburgerMenu: () => {
                let menuBar = $.createElement("div");
                menuBar.setAttribute("id", _options.menuId);
                menuBar.classList.add("sp-hb-menu-bar");

                let menu = $.createElement("div");
                menu.classList.add("sp-hb-menu");

                for (let i = 1; i <= 3; i++) {
                    let barLine = $.createElement("div");
                    barLine.setAttribute("id", "bar" + i);
                    barLine.classList.add("bar");
                    if (_options.hamburger) {
                        if (_options.hamburger.lineColor)
                            barLine.style.backgroundColor = _options.hamburger.lineColor;
                    } else {
                        barLine.classList.add("bar-color");
                    }
                    menu.appendChild(barLine);
                }
                menuBar.appendChild(menu);

                let ulNav = $.createElement("ul");
                ulNav.classList.add("sp-hb-nav");
                menuBar.appendChild(ulNav);

                var bgDiv = $.createElement("div");
                bgDiv.setAttribute("id", "sp-hb-menu-bg");
                bgDiv.classList.add("sp-hb-menu-bg");
                bgDiv.style.height = window.innerHeight + "px";

                if (_options.hamburger.backgroundColor) {
                    bgDiv.style.backgroundColor = _options.hamburger.backgroundColor;
                }
                menuBar.appendChild(bgDiv);

                if (_options.brandName?.length > 0 || _options.brandLogoUrl?.length > 0) {
                    var brandName = htmlUtility.setBrandName(['sp-hb-navbar-brand'], _options.brandName, _options.brandLogoUrl);
                    menuBar.appendChild(brandName);
                }

                $.querySelector("body")?.insertBefore(menuBar, $.querySelector("#" + id));
                menu.addEventListener("click", eventListners.onHamburgerMenuClick);
                return ulNav;

            },
            setNavigationMenu: () => {

                let nav = $.createElement("nav");
                const navClass = ["navbar", "fixed-top", "navbar-expand", "navbar-dark", "flex-column", "flex-md-row", "bd-navbar"];
                nav.classList.add(...navClass);

                if (_options.brandName?.length > 0 || _options.brandLogoUrl?.length > 0) {
                    //navbrand name
                    let navBrand = htmlUtility.setBrandName(["navbar-brand", "mb-0", "h1"], _options.brandName, _options.brandLogoUrl);
                    nav.appendChild(navBrand);
                }
                let navDiv = $.createElement("div");
                navDiv.setAttribute("id", "navbarNav");
                navDiv.classList.add("navbar-nav-scroll");

                let navUl = $.createElement("ul");
                navUl.setAttribute("id", _options.menuId);
                let navUlClass = ["navbar-nav", "bd-navbar-nav", "flex-row"]
                navUl.classList.add(...navUlClass);
                navDiv.appendChild(navUl);
                nav.appendChild(navDiv);


                $.querySelector("body")?.insertBefore(nav, $.querySelector("#" + id));
                return navUl;
            },
            setSection: (section: ISection, index: number) => {
                let sectionDiv = $.createElement("div");
                sectionDiv.setAttribute("id", "section-" + index);
                sectionDiv.classList.add("section");
                if (section.active) {
                    sectionDiv.classList.add("active");
                }
                if (section.templateUrl) {
                    const response = `<sp-include url="${section.templateUrl}"/>`;
                    sectionDiv.innerHTML = response;
                } else if (section.template) {
                    sectionDiv.innerHTML = section.template;
                }
                htmlUtility.setSectionClass(sectionDiv);
                htmlUtility.setSectionHeight(sectionDiv);
                return sectionDiv;
            },
            fetchView: () => {
                let spInclude = this._activeSection.querySelector("sp-include");
                if (spInclude) {
                    let url: any = spInclude.getAttribute("url");
                    fetch(url)
                        .then((response) => {
                            return response.text();
                        })
                        .then((text) => {
                            let spCell: any = this._activeSection.querySelector(".sp-cell");
                            spCell.innerHTML = text;
                        });
                }
            }
        }
        //#endregion

        //#region Scroll Events
        const scrollEvents = {
            scrollPageUp: () => {
                let sec_id: string = "";
                if (this._activePageIndex > 0) {
                    sec_id = this._sectionIds[--this._activePageIndex];
                } else {
                    if (_options.autoScrolling) {
                        this._activePageIndex = this._sectionIds.length - 1;
                        sec_id = this._sectionIds[this._activePageIndex];
                    }
                }
                if (sec_id === "") {
                    this.canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageRight: () => {
                let sec_id: string = "";
                if (this._activePageIndex > 0) {
                    sec_id = this._sectionIds[--this._activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        this._activePageIndex = this._sectionIds.length - 1;
                        sec_id = this._sectionIds[this._activePageIndex];
                    }
                }
                if (sec_id === "") {
                    this.canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageDown: () => {
                let sec_id: string = "";
                if (this._activePageIndex < this._sectionIds.length - 1) {
                    sec_id = this._sectionIds[++this._activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        this._activePageIndex = 0;
                        sec_id = this._sectionIds[this._activePageIndex];
                    }
                }
                if (sec_id === "") {
                    this.canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollPageLeft: () => {
                let sec_id: string = "";
                if (this._activePageIndex < this._sectionIds.length - 1) {
                    sec_id = this._sectionIds[++this._activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        this._activePageIndex = 0;
                        sec_id = this._sectionIds[this._activePageIndex];
                    }
                }
                if (sec_id === "") {
                    this.canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id);
            },
            scrollToSection: (sectionId: any) => {
                this._activeSection = $.querySelector(`[data-anchor='${sectionId}']`) as HTMLElement;
                this._activePageIndex = this._sectionIds.indexOf(sectionId);

                if (this._activeSection) {
                    htmlUtility.fetchView();
                    $e.style.transition = `all ${_options.transitionSpeed}ms ${_options.easing} 0s`;
                    switch (this.scrollWay) {
                        case Scroll.Horizontal:
                            this.pageIndex = this._activePageIndex * window.innerWidth;
                            $e.style.transform = `translate3d(-${this.pageIndex}px, 0px, 0px)`;
                            break;
                        case Scroll.Vertical:
                            this.pageIndex = this._activePageIndex * window.innerHeight;
                            if (this._activeSection.offsetTop > 0) {
                                this.pageIndex = this.pageIndex > this._activeSection.offsetTop ? this.pageIndex : this._activeSection.offsetTop;
                            }
                            $e.style.transform = `translate3d(0px, -${this.pageIndex}px, 0px)`;
                            break;
                    }
                    if (!_options.sameurl) {
                        location.hash = "#" + sectionId;
                    }
                }
            }
        }
        //#endregion

        //#region Event Listners Methods
        const eventListners = {
            keyDown: (key: { which: any; }) => {
                switch (key.which) {
                    case 37://ArrowLeft
                        if (this.canScroll && _options.navigation === "horizontal") {
                            this.canScroll = false;
                            scrollEvents.scrollPageRight();
                        }
                        break;
                    case 38://ArrowUp
                        if (this.canScroll && _options.navigation === "vertical") {
                            this.canScroll = false;
                            scrollEvents.scrollPageUp();
                        }
                        break;
                    case 39://ArrowRight
                        if (this.canScroll && _options.navigation === "horizontal") {
                            this.canScroll = false;
                            scrollEvents.scrollPageLeft();
                        }
                        break;
                    case 40://ArrowDown
                        if (this.canScroll && _options.navigation === "vertical") {
                            this.canScroll = false;
                            scrollEvents.scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: (e: any) => {
                this._scrollings.push(this._lastScrollCount);
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if (_options.scrollbar) {
                    e.preventDefault();
                }

                clearTimeout(this.scrollerTime);
                this.scrollerTime = setTimeout(() => {
                    if (this.canScroll && (this._lastScrollCount === this._scrollings.length)) {
                        this.canScroll = false;
                        this._scrollings = [];
                        this._lastScrollCount = 0;
                        clearInterval(this.scrollerTime);
                        var averageEnd = utilityMethod.getAverage(this._scrollings, 10);
                        var averageMiddle = utilityMethod.getAverage(this._scrollings, 70);
                        var isAccelerating = averageEnd >= averageMiddle;

                        //to avoid double swipes...
                        if (isAccelerating && isScrollingVertically) {
                            //scrolling down?
                            if (delta < 0) {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageDown() : scrollEvents.scrollPageLeft();
                            } else {
                                _options.navigation === "vertical" ? scrollEvents.scrollPageUp() : scrollEvents.scrollPageRight();
                            }
                        }
                    }
                }, 100);
                this._lastScrollCount = this._scrollings.length;
                return false;
            },
            windowResize: () => {
                var activeId;
                document.querySelectorAll(".section").forEach((element: any) => {
                    htmlUtility.setSectionHeight(element);
                    htmlUtility.setSectionHeight(element.querySelector(".sp-cell"));
                    if (element.classList.contains("active")) {
                        activeId = element.getAttribute("data-anchor")
                    }
                });
                let ele = $.querySelector("#sp-hb-menu-bg") as HTMLElement;
                if (ele) {
                    ele.style.height = window.innerHeight + "px";
                }
                scrollEvents.scrollToSection(activeId);

            },
            transitionStart: (e: any) => {
                const section = $.querySelector(".section.active");
                section?.classList.remove("active");
                if (_options.pageTransitionStart instanceof Function) {
                    _options.pageTransitionStart(section as HTMLElement, this._activeSection);
                }
                let prevId = section?.getAttribute("data-anchor");
                let id = this._activeSection?.getAttribute("data-anchor");
                $.querySelector(".nav-link[href='#" + prevId + "']")?.classList.remove("active");
                $.querySelector(".nav-link[href='#" + id + "']")?.classList.add("active");
            },
            transitionEnd: (e: any) => {
                this._activeSection?.classList.add("active");
                this.canScroll = true;
                if (_options.pageTransitionEnd instanceof Function) {
                    _options.pageTransitionEnd(this._activeSection);
                }
            },
            swipeUp: () => {
                if (this.canScroll) {
                    this.canScroll = false;
                    scrollEvents.scrollPageDown();
                }
            },
            swipeDown: () => {
                if (this.canScroll) {
                    this.canScroll = false;
                    scrollEvents.scrollPageUp();
                }
            },
            swipeLeft: () => {
                if (this.canScroll) {
                    this.canScroll = false;
                    scrollEvents.scrollPageLeft();
                }
            },
            swipeRight: () => {
                if (this.canScroll) {
                    this.canScroll = false;
                    scrollEvents.scrollPageRight();
                }
            },
            navigationClick: (e: MouseEvent) => {
                var sectionId = (e.target as HTMLElement).getAttribute("data-href");

                scrollEvents.scrollToSection(sectionId);
                if (_options.hamburger?.closeOnNavigation !== false) {
                    eventListners.onHamburgerMenuClick();
                }
            },
            onHamburgerMenuClick: () => {
                $.querySelector(".sp-hb-menu").classList.toggle("sp-hb-change");
                $.querySelector(".sp-hb-nav").classList.toggle("sp-hb-change");
                $.querySelector(".sp-hb-menu-bg").classList.toggle("sp-hb-change-bg");
            }
        }
        //#endregion

        //#region Utility Method
        const utilityMethod = {
            initSections: () => {
                htmlUtility.setInitialStyle();
                let navUl: any;
                if (_options.anchors) {
                    if (!_options.hamburger) {
                        navUl = htmlUtility.setNavigationMenu();
                    } else {
                        navUl = htmlUtility.setHamburgerMenu();
                    }
                }

                //Iterate Sections
                _options.sections.forEach((section: ISection, index: number) => {
                    let anchorId = "page" + (index + 1);

                    let sectionEle = htmlUtility.setSection(section, index + 1);
                    sectionEle.setAttribute("data-anchor", anchorId);
                    let sectionClass = section.sectionClass || [];
                    const cellEle = htmlUtility.getCellElement(sectionClass, section.verticalAlignMiddle);
                    cellEle.innerHTML = sectionEle.innerHTML;
                    sectionEle.innerHTML = "";
                    sectionEle.appendChild(cellEle);
                    $e.appendChild(sectionEle);
                    this._sectionIds.push(anchorId);
                    if (_options.anchors) {
                        //navigation
                        var anchorClass = ["nav-link", "text-nowrap"];
                        if (section.anchorClass) {
                            anchorClass = [...anchorClass, ...section.anchorClass]
                        }
                        let navLi = htmlUtility.setNavigationLink(anchorClass, section.anchor, anchorId);
                        navUl.appendChild(navLi);
                    }
                    if (section.backgroundColor) {
                        htmlUtility.setBackgroundColor(sectionEle, section.backgroundColor);
                    }
                });


                if (_options.navigation.toLowerCase() === "horizontal") {
                    htmlUtility.setSectionHorizontal($e);
                    this.scrollWay = Scroll.Horizontal;
                }
                let activeId: string | null = this._sectionIds[0];
                if (!_options.sameurl) {
                    let hash = location.hash?.replace("#", "");
                    if (hash) {
                        activeId = hash;
                    }
                } else {
                    let active = document.querySelector(".section.active");
                    if (active !== null) {
                        activeId = active.getAttribute("data-anchor");
                    }
                }
                scrollEvents.scrollToSection(activeId);
                let id = this._activeSection?.getAttribute("data-anchor");
                $.querySelector(".nav-link[href='#" + activeId + "']")?.classList.add("active");
                utilityMethod.addEventListeners($e);
            },
            addEventListeners: ($element: HTMLElement) => {
                //keyboard navigation event
                if (_options.keyboardNavigation) {
                    document.removeEventListener("keydown", eventListners.keyDown);
                    document.addEventListener("keydown", eventListners.keyDown);
                }
                //scroll event
                document.removeEventListener("wheel", eventListners.mouseWheel);
                document.addEventListener("wheel", eventListners.mouseWheel);
                //window resize event
                window.removeEventListener('resize', eventListners.windowResize);
                window.addEventListener('resize', eventListners.windowResize);
                //transition start event
                $element.removeEventListener('transitionstart', eventListners.transitionStart);
                $element.addEventListener('transitionstart', eventListners.transitionStart);
                //transition end even
                $element.removeEventListener('transitionend', eventListners.transitionEnd);
                $element.addEventListener('transitionend', eventListners.transitionEnd);

                if (this.scrollWay == Scroll.Horizontal) {
                    document.addEventListener('swiped-left', eventListners.swipeLeft);
                    document.addEventListener('swiped-right', eventListners.swipeRight);
                } else {
                    document.addEventListener('swiped-up', eventListners.swipeUp);
                    document.addEventListener('swiped-down', eventListners.swipeDown);
                }
            },
            getAverage: (eleList: any, num: any) => {
                let sum = 0;

                let lastEles = eleList.slice(Math.max(eleList.length - num, 1));

                for (var i = 0; i < lastEles.length; i++) {
                    sum = sum + lastEles[i];
                }

                return Math.ceil(sum / num);
            },
            addToPublicAPI: () => {
                this.api.gotoPage = scrollEvents.scrollToSection;
                if (this.scrollWay === Scroll.Horizontal) {
                    this.api.navigateToNextPage = scrollEvents.scrollPageRight;
                    this.api.navigateToPrevPage = scrollEvents.scrollPageLeft;
                } else {
                    this.api.navigateToNextPage = scrollEvents.scrollPageDown;
                    this.api.navigateToPrevPage = scrollEvents.scrollPageUp;
                }
                this.api.getMenuItems = (): NodeListOf<Element> => {
                    return $.querySelectorAll(`.nav-item`);
                }
                this.api.getActiveMenuItem = (): HTMLElement => {
                    var sec_id= this._sectionIds[this._activePageIndex];
                    return $.querySelector(`[data-anchor='${sec_id}']`) as HTMLElement;
                }
            }
        }
        //#endregion


        //#endregion
        utilityMethod.initSections();
    }

    api: ISitePage = {
        gotoPage: (pageId: string) => {

        },
        navigateToNextPage: () => {

        },
        navigateToPrevPage: () => {

        },
        getMenuItems: (): NodeListOf<Element> => {
            return null;
        },
        getActiveMenuItem: (): HTMLElement => {
            return null;
        }
    }
}
const enum Scroll {
    Horizontal = 1,
    Vertical = 2
}
interface IOptions {
    brandName: string,
    brandLogoUrl: string,
    backgroundColor: string,
    anchors: boolean,
    menuId: string,
    verticalAlignMiddle: boolean,
    sections: ISection[],
    navigation: string,
    hamburger: IHamburger
    autoScrolling: boolean,
    keyboardNavigation: boolean,
    scrollbar: boolean,
    transitionSpeed: number,
    easing: string,
    sameurl: boolean,
    pageTransitionStart: (prevPage: HTMLElement, currentPage: HTMLElement) => void,
    pageTransitionEnd: (currentPage: HTMLElement) => void,
}
interface ISection {
    active:boolean,
    anchor: string,
    template:string,
    templateUrl: string,
    backgroundColor: string,
    verticalAlignMiddle: boolean, //true||false
    sectionClass: string[],
    anchorClass: string[]
}
interface IHamburger {
    lineColor: string,
    backgroundColor: string,
    closeOnNavigation: boolean
}
interface ISitePage {
    gotoPage: (pageId: string) => void;
    navigateToNextPage: () => void;
    navigateToPrevPage: () => void;
    getMenuItems: () => NodeListOf<Element>;
    getActiveMenuItem: () => HTMLElement;
}