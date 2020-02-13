const files_link = "https://api.github.com/repos/Nogitsu/GNLib/contents/"
const raw_link = "https://raw.githubusercontent.com/Nogitsu/GNLib/master/"

const vgui_better_name = {
    gncharbutton: "GNCharButton",
    gncolorpicker: "GNColorPicker",
    gncombobox: "GNComboBox",
    gngroupbox: "GNGroupBox",
    gniconbutton: "GNIconButton",
    gnnumentry: "GNNumEntry",
    gntaglist: "GNTagList",
    gntextentry: "GNTextEntry",
    gntogglebutton: "GNToggleButton",
    gntooltip: "GNToolTip",
    gnrichtext: "GNRichText",
}

function fetch_json( link ) {
    return new Promise( ( res, rej ) => {
        fetch( link )
            .then( response => response.json() )
            .then( json => res( json ) )
    } )
}

function get_content( link ) {
    return new Promise( ( res, rej ) => {
        var xhr = new XMLHttpRequest()
        xhr.open( "GET", link ) 
        xhr.onload = () => {
            res( xhr.responseText )
        }
        xhr.onerror = () => {
            rej()
        }
        xhr.send()
    } )
}

function fetch_documentation_name( link, array ) {
    get_content( link )
        .then( response => {
            const lines = response.split( "\n" )
            for ( let i = 0; i < lines.length; i++ ) {
                const v = lines[i]
                if ( v.includes( "@title:" ) ) {
                    let name = lines[i + 1].match( /\w+.\w+/i )[0] // get next line and get the function name
                    array.push( name )
                }
            } 
        } )
}

function component_to_hex( c ) {
    const hex = Number( c ).toString( 16 );
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgb_to_hex( r, g, b ) {
    return "#" + component_to_hex( r ) + component_to_hex( g ) + component_to_hex( b );
}

const nav = new Vue( {
    el: ".main",
    data: {
        search: "",
        links: {
            vgui: "lua/vgui/",
            color: "lua/gnlib/shared/sh_colors.lua",
        },
        docs: {
            util: { 
                link: "lua/gnlib/shared/sh_util.lua", 
                el: [] 
            },
            recursive: {
                link: "lua/gnlib/shared/sh_recursive.lua",
                el: [],
            },
            iterator: {
                link: "lua/gnlib/shared/sh_iterator.lua",
                el: [],
            },
            derma: {
                link: "lua/gnlib/client/cl_derma.lua",
                el: []
            },
            font: {
                link: "lua/gnlib/client/cl_font.lua",
                el: [],
            },
            draw: { 
                link: "lua/gnlib/client/cl_draw.lua", 
                el: [] 
            },
        },
        vgui: [],
        /*util: [],
        draw: [],
        iterator: [],*/
        color: [],
    },
    created() {
        //  > VGUI
        fetch_json( files_link + this.links.vgui )
            .then( json => {
                json.forEach( v => {
                    var name = v.name.replace( ".lua", "" )
                    if ( vgui_better_name[name] ) {
                        name = vgui_better_name[name]
                    }
                    else name = name.slice( 0, 3 ).toUpperCase() + name.slice( 3, name.lenght )

                    this.vgui.push( name )
                } )
            } )

        //  > Color
        get_content( raw_link + this.links.color )
            .then( response => {
                const lines = response.split( "\n" )
                for ( let i = 0; i < lines.length; i++ ) {
                    const v = lines[i]
                    if ( v.includes( "GNLib.Colors." ) ) {
                        let name = v.match( /GNLib.Colors.\w+/i )[0]
                        let color = v.match( /\d+, \d+, \d+/i )[0].split( ", " )
                            color = rgb_to_hex( color[0], color[1], color[2] )                            
                        
                        this.color.push( { name: name, color: color } )
                    }
                }
            } )

        //  > Docs
        for ( const k in this.docs ) {
            const v = this.docs[k]
            fetch_documentation_name( raw_link + v.link, this.docs[k].el )
        }
    }
} ) 