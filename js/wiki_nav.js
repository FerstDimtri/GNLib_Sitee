var files_link = "https://api.github.com/repos/Nogitsu/GNLib/contents/"
var raw_link = "https://raw.githubusercontent.com/Nogitsu/GNLib/master/"

function fetch_json( link ) {
    return new Promise( ( res, rej ) => {
        fetch( link )
            .then( response => response.json() )
            .then( json => res( json ) )
    } )
}

var main = new Vue( {
    el: ".vertical-menu",
    data: {
        vgui: [],
        util: [],
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
        var xhr = new XMLHttpRequest()
        xhr.open( "GET", raw_link + "lua/gnlib/shared/sh_util.lua" ) 
        xhr.onload = () => {
            var lines = xhr.responseText.split( "\n" )
            lines.forEach( v => {
                //  > TODO: read each documentation like in GNLib.MakeDocumentation
            } )
        }
        xhr.send()
    }
} ) 