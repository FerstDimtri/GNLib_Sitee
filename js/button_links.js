const button_links = new Vue( {
    el: ".main",
    data: {
<<<<<<< Updated upstream
        buttons: [
            { 
                title: "Accueil", 
                link: "index.html" 
            },
            { 
                title: "Wiki", 
                link: "wiki.html" 
            },
            { 
                title: "Github", 
                link: "https://github.com/Nogitsu/GNLib"
            },
            { 
                title: "Discord", 
                link: "https://discord.gg/U425mC" 
            },
        ]
=======
        buttons: {
            ["Accueil"]: "#",
            ["Wiki"]: "wiki/index.html",
            ["Docmaker"]: "docmaker.html",
            ["Github"]: "https://github.com/Nogitsu/GNLib",
            ["Discord"]: "https://discord.gg/U425mC",
        }
>>>>>>> Stashed changes
    }
} )