export const enum Scroll {
    Horizontal = "horizontal",
    Vertical = "vertical"
}

export interface IOptions {
    brandName?: string;
    brandLogoUrl?: string;
    backgroundColor?: string;
    navigation: Scroll;
    menuId: string;
    anchors?: boolean;
    hamburger?: boolean | IHamburger;
    pageIndicator?: boolean;
    verticalAlignMiddle?: boolean;
    autoScrolling?: boolean;
    keyboardNavigation?: boolean;
    scrollbar?: boolean;
    transitionSpeed?: number;
    easing?: string;
    sameurl?: boolean;
    sections: ISection[];
    pageTransitionStart?: (prevPage: HTMLElement, currentPage: HTMLElement) => void,
    pageTransitionEnd?: (currentPage: HTMLElement) => void,
}
export interface ISection {
    active:boolean,
    anchor: string,
    template:string,
    templateUrl: string,
    templateId:string,
    backgroundColor: string,
    verticalAlignMiddle: boolean, //true||false
    sectionClass: string[] | string,
    anchorClass: string[] | string
}
export interface IHamburger {
    lineColor: string,
    backgroundColor: string,
    closeOnNavigation: boolean
}
export interface ISitePage {
    gotoPage: (pageId: string) => void;
    navigateToNextPage: () => void;
    navigateToPrevPage: () => void;
    getMenuItems: () => NodeListOf<Element>;
    getActivePage: () => HTMLElement;
}