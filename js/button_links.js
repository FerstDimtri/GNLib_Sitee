const button_links = new Vue( {
    el: ".main",
    data: {
        buttons: [
            {
                ["Wiki"]: "wiki/index.html",
                ["Docmaker"]: "docmaker.html",
            },
            {
                ["Github"]: "https://github.com/Nogitsu/GNLib",
                ["Discord"]: "https://discord.gg/U425mC"
            }
        ]
    }
} )