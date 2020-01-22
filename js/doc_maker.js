
const docmaker = new Vue( {
    el: ".docmaker",
    data: {
        args: {
            title: "Title",
            note: "",
        },
    },
    computed: {
        getOutput() {
            let output = ""

            for ( const k in this.args ) {
                const v = this.args[k]
                if ( v === "" ) continue
                
                output += `--- @${k}:\n`
                output += `--- ${v}: <> ...\n`
            }

            console.log(output);
            
            return output
        },
    },
} )