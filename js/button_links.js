const button_links = new Vue( {
    el: ".main",
    data: {
        buttons: [
            { title: "Accueil", link: "index.html" },
            { title: "Wiki", link: "wiki.html" },
            { title: "Github", link: "https://github.com/Nogitsu/GNLib" },
            { title: "Discord", link: "https://discord.gg/U425mC" },
        ]
    }
} )