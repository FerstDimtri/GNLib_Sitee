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
        title: "Not found",
        usage: "",
        description: "No description",
        args: [],
        example: {
            pre_text: "",
            code: "",
            post_text: ""
        },
        output: "",
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
                    if ( v.search( "---" ) < 0 ) {
                        arg_type = null
                        continue
                    }

                    //console.log( v);
                    
                    const arg = v.match( /@(\w+)/ )
                    if ( arg ) {
                        arg_type = arg[1];
                        continue
                    }

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
                    else if ( arg_type == "params" ) {                      
                        if ( !has_found ) continue

                        const match = v.match( /---\s+([^\s]+): <(\w+)> (.+)/ )
                        const name = match[1]
                        const type = match[2]
                        const desc = match[3]

                        this.args.push( { type: type, name: name, prompt: desc } )
                    }
                } 
            } )
    },
} )