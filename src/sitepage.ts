
/*!
 * sitePage.js - v1.0.9
 * https://github.com/pixelbyaj/SitePage
 * @author Abhishek Joshi
 * @license MIT
 */
class SitePage {
    constructor(id: string, options: any) {

        if (!id) {
            throw "Page element not found";
        }
        let $ = document;
        let $e: any = $.getElementById(id);
        if (!$e) {
            throw "Page element not found";
        }

        const enum Scroll {
            Horizontal = 1,
            Vertical = 2
        }

        let _options: any = {
            //brandName
            brandName: "sitePage",
            backgroundColor: "#fc6c7c",
            //menu
            menuId: "sp-menu",
            anchors: true,
            //navigaiton
            verticalAlignMiddle: true,
            sections: [],
            navigation: "vertical",
            //scrolling and transition
            autoScrolling: true,
            keyboardNavigation: true,
            scrollbar: false,
            transitionSpeed: 1000,
            easing: "ease",
            //url changes
            sameurl: true,
            //events
            pageTransitionStart: (prevPage: HTMLElement, currentPage: HTMLElement) => { },
            pageTransitionEnd: (currentPage: HTMLElement) => { },
        };

        if (options) {
            _options = { ..._options, ...options };
        }

        //#region Private Variables
        let scrollWay = Scroll.Vertical;
        let _scrollings: any[] = [];
        let _lastScrollCount = 0;
        let _sectionIds: string[] = [];
        let _activePageIndex: number;
        let _activeSection: HTMLElement;
        let pageIndex: number = 0;
        let canScroll = true;
        let scrollerTime: any;
        //#endregion

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
                element.style.width = (_sectionIds.length * 100) + "%";
                element.classList.add("sp-floatLeft");
                element.querySelectorAll(".section").forEach((e: any) => {
                    e.classList.add("sp-floatLeft");
                    e.style.width = (100 / _sectionIds.length) + "%";

                });
            },
            getCellElement: (classList: string[], verticalAlignMiddle: Boolean): any => {
                var cellDiv = $.createElement("div");
                cellDiv.setAttribute("class", "sp-cell");
                if (_options.verticalAlignMiddle) {
                    if (verticalAlignMiddle === undefined || verticalAlignMiddle)
                        classList.push(...["align-middle","text-center"]);
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
            getBrandName: (classList: string[], brandName: string): HTMLElement => {


                let navSpan = $.createElement("span");
                navSpan.classList.add(...classList);

                let textNode = $.createTextNode(brandName);
                navSpan.appendChild(textNode);

                return navSpan;
            },
            getNavigationLink: (classList: string[], anchor: string, anchorId: string): HTMLElement => {
                let navLi = $.createElement("li");
                navLi.classList.add("nav-item");

                let navA = $.createElement("a");
                navA.classList.add(...classList);
                navA.removeEventListener("click", eventListners.navigationClick);
                if (_options.sameurl) {
                    navA.setAttribute("href", "javascript:void(0)");
                    navA.setAttribute("data-href", anchorId);
                    navA.addEventListener("click", eventListners.navigationClick);
                } else {
                    navA.setAttribute("href", "#" + anchorId);
                }

                let textNode = $.createTextNode(anchor);
                navA.appendChild(textNode);

                navLi.appendChild(navA);
                return navLi;
            },
            setNavigationMenu: () => {

                let nav = $.createElement("nav");
                const navClass = ["navbar", "fixed-top", "navbar-expand", "navbar-dark", "flex-column", "flex-md-row", "bd-navbar"];
                nav.classList.add(...navClass);

                //navbrand name
                let navBrand = htmlUtility.getBrandName(["navbar-brand", "mb-0", "h1"], _options.brandName);
                nav.appendChild(navBrand);

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
            setSection: (section: any, index: number) => {
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
                let spInclude = _activeSection.querySelector("sp-include");
                if (spInclude) {
                    let url: any = spInclude.getAttribute("url");
                    fetch(url)
                        .then((response) => {
                            return response.text();
                        })
                        .then((text) => {
                            let spCell: any = _activeSection.querySelector(".sp-cell");
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
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Vertical);
            },
            scrollPageRight: () => {
                let sec_id: string = "";
                if (_activePageIndex > 0) {
                    sec_id = _sectionIds[--_activePageIndex];
                }
                else {
                    if (_options.autoScrolling) {
                        _activePageIndex = _sectionIds.length - 1;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Horizontal);
            },
            scrollPageDown: () => {
                let sec_id: string = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Vertical);
            },
            scrollPageLeft: () => {
                let sec_id: string = "";
                if (_activePageIndex < _sectionIds.length - 1) {
                    sec_id = _sectionIds[++_activePageIndex]
                } else {
                    if (_options.autoScrolling) {
                        _activePageIndex = 0;
                        sec_id = _sectionIds[_activePageIndex];
                    }
                }
                if (sec_id === "") {
                    canScroll = true;
                    return;
                }
                scrollEvents.scrollToSection(sec_id, Scroll.Horizontal);
            },
            scrollToSection: (sectionId: any, ScrollWay: Scroll) => {
                _activeSection = $.querySelector(`[data-anchor='${sectionId}']`) as HTMLElement;
                _activePageIndex = _sectionIds.indexOf(sectionId);

                if (_activeSection) {
                    htmlUtility.fetchView();
                    $e.style.transition = `all ${_options.transitionSpeed}ms ${_options.easing} 0s`;
                    switch (ScrollWay) {
                        case Scroll.Horizontal:
                            pageIndex = _activePageIndex * window.innerWidth;
                            $e.style.transform = `translate3d(-${pageIndex}px, 0px, 0px)`;
                            break;
                        case Scroll.Vertical:
                            pageIndex = _activePageIndex * window.innerHeight;
                            if (_activeSection.offsetTop > 0) {
                                pageIndex = pageIndex > _activeSection.offsetTop ? pageIndex : _activeSection.offsetTop;
                            }
                            $e.style.transform = `translate3d(0px, -${pageIndex}px, 0px)`;
                            break;
                    }
                    if (!_options.sameurl) {
                        location.hash = sectionId;
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
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageRight();
                        }
                        break;
                    case 38://ArrowUp
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageUp();
                        }
                        break;
                    case 39://ArrowRight
                        if (canScroll && _options.navigation === "horizontal") {
                            canScroll = false;
                            scrollEvents.scrollPageLeft();
                        }
                        break;
                    case 40://ArrowDown
                        if (canScroll && _options.navigation === "vertical") {
                            canScroll = false;
                            scrollEvents.scrollPageDown();
                        }
                        break;
                }
            },
            mouseWheel: (e: any) => {
                _scrollings.push(_lastScrollCount);
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

                clearTimeout(scrollerTime);
                scrollerTime = setTimeout(() => {
                    if (canScroll && (_lastScrollCount === _scrollings.length)) {
                        canScroll = false;
                        _scrollings = [];
                        _lastScrollCount = 0;
                        clearInterval(scrollerTime);
                        var averageEnd = utilityMethod.getAverage(_scrollings, 10);
                        var averageMiddle = utilityMethod.getAverage(_scrollings, 70);
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
                _lastScrollCount = _scrollings.length;
                return false;
            },
            windowSize: () => {
                var activeId;
                document.querySelectorAll(".section").forEach((element: any) => {
                    htmlUtility.setSectionHeight(element);
                    htmlUtility.setSectionHeight(element.querySelector(".sp-cell"));
                    if (element.classList.contains("active")) {
                        activeId = element.getAttribute("data-anchor")
                    }
                });
                scrollEvents.scrollToSection(activeId, scrollWay);

            },
            hashChange: () => {
                if (!_options.sameurl) {
                    let hash = location.hash?.replace("#", "");
                    scrollEvents.scrollToSection(hash, scrollWay);
                }
            },
            transitionStart: (e: any) => {
                const section = $.querySelector(".section.active");
                section?.classList.remove("active");
                if (_options.pageTransitionStart instanceof Function) {
                    _options.pageTransitionStart(section, _activeSection);
                }
                let prevId = section?.getAttribute("data-anchor");
                let id = _activeSection?.getAttribute("data-anchor");
                $.querySelector(".nav-link[href='#" + prevId + "']")?.classList.remove("active");
                $.querySelector(".nav-link[href='#" + id + "']")?.classList.add("active");
            },
            transitionEnd: (e: any) => {
                _activeSection?.classList.add("active");
                canScroll = true;
                if (_options.pageTransitionEnd instanceof Function) {
                    _options.pageTransitionEnd(_activeSection);
                }
            },
            swipeUp: () => {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageDown();
                }
            },
            swipeDown: () => {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageUp();
                }
            },
            swipeLeft: () => {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageLeft();
                }
            },
            swipeRight: () => {
                if (canScroll) {
                    canScroll = false;
                    scrollEvents.scrollPageRight();
                }
            },
            navigationClick: (e: MouseEvent) => {
                var sectionId = (e.target as HTMLElement).getAttribute("data-href");
                scrollEvents.scrollToSection(sectionId, scrollWay);
            }
        }
        //#endregion

        //#region Utility Method
        const utilityMethod = {
            initSections: () => {
                htmlUtility.setInitialStyle();
                let navUl: any = htmlUtility.setNavigationMenu();

                //Iterate Sections
                _options.sections.forEach((section: any, index: number) => {
                    let anchorId = "page" + (index + 1);

                    let sectionEle = htmlUtility.setSection(section, index + 1);
                    sectionEle.setAttribute("data-anchor", anchorId);
                    let sectionClass = section.sectionClass || [];
                    const cellEle = htmlUtility.getCellElement(sectionClass, section.verticalAlignMiddle);
                    cellEle.innerHTML = sectionEle.innerHTML;
                    sectionEle.innerHTML = "";
                    sectionEle.appendChild(cellEle);
                    $e.appendChild(sectionEle);
                    _sectionIds.push(anchorId);
                    if (_options.anchors) {
                        //navigation
                        var anchorClass = ["nav-link", "text-nowrap"];
                        if (section.anchorClass) {
                            anchorClass = [...anchorClass, ...section.anchorClass]
                        }
                        let navLi = htmlUtility.getNavigationLink(anchorClass, section.anchor, anchorId);
                        navUl.appendChild(navLi);
                    }
                    if (section.backgroundColor) {
                        htmlUtility.setBackgroundColor(sectionEle, section.backgroundColor);
                    }
                });


                if (_options.navigation.toLowerCase() === "horizontal") {
                    htmlUtility.setSectionHorizontal($e);
                    scrollWay = Scroll.Horizontal;
                }
                let activeId: string | null = _sectionIds[0];
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
                scrollEvents.scrollToSection(activeId, scrollWay);
                let id = _activeSection?.getAttribute("data-anchor");
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
                window.removeEventListener('resize', eventListners.windowSize);
                window.addEventListener('resize', eventListners.windowSize);
                //transition start event
                $element.removeEventListener('transitionstart', eventListners.transitionStart);
                $element.addEventListener('transitionstart', eventListners.transitionStart);
                //transition end even
                $element.removeEventListener('transitionend', eventListners.transitionEnd);
                $element.addEventListener('transitionend', eventListners.transitionEnd);

                if (scrollWay == Scroll.Horizontal) {
                    document.addEventListener('swiped-left', eventListners.swipeLeft);
                    document.addEventListener('swiped-right', eventListners.swipeRight);
                } else {
                    document.addEventListener('swiped-up', eventListners.swipeUp);
                    document.addEventListener('swiped-down', eventListners.swipeDown);
                }

                if (!_options.sameurl) {
                    window.addEventListener('hashchange', eventListners.hashChange);
                }
            },
            getAverage: (eleList: any, num: any) => {
                let sum = 0;

                let lastEles = eleList.slice(Math.max(eleList.length - num, 1));

                for (var i = 0; i < lastEles.length; i++) {
                    sum = sum + lastEles[i];
                }

                return Math.ceil(sum / num);
            }
        }
        //#endregion

        //#endregion
        utilityMethod.initSections();
    }

}