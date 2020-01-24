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


const right = new Vue( {
    el: ".right",
    data: {
        title: "",
        usage: "",
        note: "",
        description: "",
        args: [],
        example: {
            pre_text: "",
            code: "print( 'you make me sick' )\nprint( 'Luke, I\'am your father' )",
            output: "https://cdn.discordapp.com/attachments/638822462431166495/638822480169140226/unknown.png"
        },
        output: [
            {
                type: "function",
                name: "Boloss",
                prompt: "Result of madness"
            }
        ],
    },
    created() {
        const args = location.href.split( "?" )
        args.shift()

        let file = args[0]
        if ( !file ) return
        file = file.replace( "file=", "" )

        let search = args[1]
        if ( !search ) return
        search = search.replace( "search=", "" )

        console.log( file, search );
        /* SEARCH FOR DOCUMENTATION */
        get_content( raw_link + file )
            .then( response => {
                const lines = response.split( "\n" )

                let arg_type, has_found
                for ( let i = 0; i < lines.length; i++ ) {
                    const v = lines[i]

                    //  > Don't continue if this is not a doc comment
                    if ( v.search( "---" ) < 0 ) {
                        arg_type = null
                        continue
                    }

                    //  > Look for a param
                    const arg = v.match( /@(\w+)/ )
                    if ( arg ) {
                        arg_type = arg[1];
                        continue
                    }

                    //  > Get title
                    if ( arg_type == "title" ) {
                        if ( has_found ) { 
                            has_found = false 
                            continue 
                        }

                        const match = v.match( /---\s+([^\s]+): <\w+> (.+)/ )
                        const name = match[1]
                        const desc = match[2]
                        if ( !( name == search ) ) continue

                        this.title = name
                        this.description = desc

                        has_found = true
                    }
                    //  > Get params
                    else if ( arg_type == "params" ) {                      
                        if ( !has_found ) continue

                        const match = v.match( /---\s+([^\s]+): <(\w+)> (.+)/ )
                        const name = match[1]
                        const type = match[2]
                        const desc = match[3]

                        this.args.push( { type: type, name: name, prompt: desc } )
                    }
                    //  > Get note
                    else if ( arg_type == "note" ) {
                        if ( !has_found ) continue

                        const match = v.match( /---\s+(.+)/ )[1]

                        this.note = match
                    }
                } 
                //  > Make usage (for functions)
                if ( this.title && this.args ) {
                    let params = []
                    this.args.forEach( v => {
                        params.push( `${v.type} ${v.name}` )
                    } );

                    this.usage = `${this.title}( ${params.join( ", " )} )`
                }
            } )
    },
} )