Document.prototype.ready = function(fn) {
    var readyFunc = function(resolve, reject) {
        // The ready event handler and self cleanup method
        function completed() {
            document.removeEventListener("DOMContentLoaded", completed);
            window.removeEventListener("load", completed);
            resolve();
        }

        // Catch cases where $(document).ready() is called
        // after the browser event has already occurred.
        if (document.readyState !== "loading") {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            window.setTimeout(completed);

        } else {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", completed);
            // A fallback to window.onload, that will always work
            window.addEventListener("load", completed);
        }
    }
    var promise = new Promise(readyFunc);
    promise
        .then(fn)
        .catch(function(error) {
            throw error;
        });
    return promise;
};

document.ready(function() {
    new SitePage("sitePage", {
        brandName: "PixelByAJ",
        backgroundColor: "",
        verticalAlignMiddle: true, //true||false
        sections: [{
                anchor: "Home",
                //anchorClass: [],
                templateUrl: "./views/home.html",
                backgroundColor: "#ff5f45",
                verticalAlignMiddle: true, //true||false
                sectionClass: ['text-right']
            },
            {
                anchor: "Skills",
                templateUrl: "./views/skills.html",
                backgroundColor: "#fec401"
            },
            {
                anchor: "Projects",
                template: "<h1>Projects</h1>",
                backgroundColor: "#fc6c7c"
            },
            {
                anchor: "Open Source",
                templateUrl: "./views/opensource.html",
                backgroundColor: "#ff5f45"
            },
            {
                anchor: "Achievements",
                templateUrl: "./views/achievements.html",
                backgroundColor: "#fec401"
            },
            {
                anchor: "Contact Us",
                template: "<h2>Contact Us</h2>",
                backgroundColor: "#fec401"
            }
        ],
        //navigation: "horizontal|vertical",
        anchors: true, //default true
        hamburger: {
            lineColor: "#fff",
            //closeOnNavigation: false,
            //backgroundColor: ""
        },
        easing: "ease",
        //sameurl: true|false,
        transitionSpeed: 1000,
        keyboardNavigation: true,
        pageTransitionStart: (prevPage, currentPage) => {
            console.log(`prevPage: ${prevPage ? prevPage.id : ""} currentPage :${currentPage.id}`);
        },
        pageTransitionEnd: (currentPage) => {
            console.log(`currentPage :${currentPage.id}`);

        }
    });
});