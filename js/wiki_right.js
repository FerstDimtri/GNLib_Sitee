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
        side: "",
        title: "",
        usage: "",
        note: "",
        description: "",
        args: [],
        example: {
            prompt: "",
            code: "",
            output: ""
        },
        output: [],
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

        if ( file.includes( "shared" ) ) {
            this.side = "shared"
        }
        else if ( file.includes( "client" ) ) {
            this.side = "client"
        }
        else {
            this.side = "server"
        }
        
        /* SEARCH FOR DOCUMENTATION */
        get_content( raw_link + file )
            .then( response => {
                const lines = response.split( "---" )              
                //const lines = response.split( "\n" )              

                let arg_type, has_found
                for ( let i = 0; i < lines.length; i++ ) {
                    const v = lines[i]

                    //  > Don't continue if this is not a doc comment
                    /* if ( v.search( "---" ) < 0 ) {
                        arg_type = null
                        continue
                    } */

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

                        const match = v.match( /\s+([^\s]+): <\w+> (.+)/ )
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

                        const match = v.match( /\s+([^\s]+): <(\w+)> (.+)/ )
                        const name = match[1]
                        const type = match[2]
                        const desc = match[3]

                        this.args.push( { type: type, name: name, prompt: desc } )
                    }
                    //  > Get example
                    else if ( arg_type == "example" ) {                      
                        if ( !has_found ) continue

                        const match = v.match( /\s+#([^\s]+): (.+)/ )
                        if ( match == null ) continue

                        const name = match[1]
                        let desc = match[2]
                        
                        if ( !( this.example[name] == null ) ) {
                            // replace \n and \t
                            if ( name == "code" ) {
                                desc = desc.replace( /\\n/g, "\n" ).replace( /\\t/g, "\t" )
                            }

                            this.example[name] = desc
                            //console.log( desc );
                            
                            //console.log( 'local tab = {}\n\nfor i = 0, 1000000 do\n\ttab[i] = true\nend\n\nlocal _pairs = GNLib.Benchmark( function()\n\tfor k, v in pairs( tab ) do\n\tend\nend, "pairs" )\n\nlocal _ipairs = GNLib.Benchmark( function()\n\tfor i, v in ipairs( tab ) do\n\tend\nend, "ipairs" )\n\nprint( "Fastest is: " .. ( _ipairs < _pairs and "ipairs" or "pairs" ) )' );                           
                        }
                    }
                    //  > Get return
                    else if ( arg_type == "return" ) {
                        if ( !has_found ) continue

                        const match = v.match( /\s+([^\s]+): <(\w+)> (.+)/ )
                        const name = match[1]
                        const type = match[2]
                        const desc = match[3]

                        this.output.push( { type: type, name: name, prompt: desc } )
                    }
                    //  > Get note
                    else if ( arg_type == "note" ) {
                        if ( !has_found ) continue

                        const match = v.match( /\s+(.+)/ )[1]

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