var files_link = "https://api.github.com/repos/Nogitsu/GNLib/contents/"
var raw_link = "https://raw.githubusercontent.com/Nogitsu/GNLib/master/"

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
            var lines = response.split( "\n" )
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
    var hex = Number( c ).toString( 16 );
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgb_to_hex( r, g, b ) {
    return "#" + component_to_hex( r ) + component_to_hex( g ) + component_to_hex( b );
}

var vertical_menu = new Vue( {
    el: ".vertical-menu",
    data: {
        search: "",
        vgui: [],
        util: [],
        draw: [],
        color: [],
    },
    created() {
        /* VGUI */
        fetch_json( files_link + "lua/vgui/" )
            .then( json => {
                json.forEach( v => {
                    var name = v.name.slice( 0, 3 ).toUpperCase() + v.name.slice( 3, v.name.lenght ).replace( ".lua", "" )
                    this.vgui.push( name )
                } )
            } )
            
        /* UTIL */
        fetch_documentation_name( raw_link + "lua/gnlib/shared/sh_util.lua", this.util )

        /* DRAW */
        fetch_documentation_name( raw_link + "lua/gnlib/client/cl_draw.lua", this.draw )

        /* COLOR */
        get_content( raw_link + "lua/gnlib/shared/sh_colors.lua" )
            .then( response => {
                var lines = response.split( "\n" )
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
    }
} ) 