/*
    TODO! Not currently implemented!

    In theory, I can use GitHub Actions to automatically generate the
    data pack, and resource pack, based on maybe a JSON file listing
    all of the songs, to make things easier. Haha.

    This DOES use an NPM package to copy folders!

*/

// Configure Settings
const output_folder = "./out"
const ncp = require('ncp').ncp

// End Settings

// Import Libraries
const fs = require('fs')

// Define Constants

// Define methods
function createIfNotExists(target_folder) {
    if (!fs.existsSync(target_folder))
        fs.mkdirSync(target_folder)
}

// Define steps
function generate_resource_pack() {
    function step1() {
        // Step 1.0: Create output folders!
        console.log("Creating output...")
        createIfNotExists(output_folder)

        // Step 1.1: Copy over boilerplate!
        console.log("Copying files...")
        ncp("./resource_pack", `${output_folder}/resource_pack`, () => {
            ncp("./data_pack", `${output_folder}/data_pack`, () => {
                step2()
            })  
        })
    }

    function step2() {
        // Step 2.0: Generate JSON files for every song in the records file!
        console.log("Generating songs JSON files...")
        let song_files = fs.readdirSync(`${output_folder}/resource_pack/assets/minecraft/sounds/records`)
        
        var dld = {
            "parent": "item/generated", "textures": {"layer0": "item/music_disc_11"},
            "overrides": [
                // {"predicate": {"custom_model_data":1}, "model": "item/music_disc_example"},
            ]
        }

        var sdd = {}
        
        var cmd_count = 1

        song_files.forEach((file) => { 
            if (file.toLowerCase().substr(0,1) != ".") {
                console.log(`Generating JSON file for "${file}"...`)
                var song_name = file.split('.').slice(0, -1).join('.')

                fs.writeFileSync(`${output_folder}/resource_pack/assets/minecraft/models/item/music_disk_${song_name}.json`, JSON.stringify(
                    {"parent": "item/generated", "textures": {"layer0": "item/music_disc_default"}}
                ))

                console.log(`Adding song "${song_name}" to custom models...`)
                dld.overrides.push({"predicate": {"custom_model_data":cmd_count}, "model": `item/music_disk_${song_name}`})

                console.log(`Adding song "${song_name}" to sound catalog...`)
                sdd[`music_disc.${song_name}`] = {"sounds": [{"name": `records/${song_name}`, "stream": true}]}

                console.log(`Added song ${song_name}! (ID ${cmd_count})`)

                cmd_count++;
            }
        })

        // Step 2.1: Update the "music_disk_11.json" file!
        console.log("Regenerating Music Disk 11's JSON...")
        try {fs.unlinkSync(`${output_folder}/resource_pack/assets/minecraft/models/item/music_disc_11.json`)} catch {}
        fs.writeFileSync(`${output_folder}/resource_pack/assets/minecraft/models/item/music_disk_11.json`, JSON.stringify(dld))

        // Step 2.2: Update the "sounds.json" file!
        console.log("Regenerating sound catalog's JSON...")
        try {fs.unlinkSync(`${output_folder}/resource_pack/assets/minecraft/sounds.json`)} catch {}
        fs.writeFileSync(`${output_folder}/resource_pack/assets/minecraft/sounds.json`, JSON.stringify(sdd))
    }
    step1()
}

function generate_data_pack() {
    function step1() {

    }

    step1()
}

// Run!
console.log("Generating resource pack...")
generate_resource_pack()

// TODO generate data pack!
/*
console.log("Generating data pack...")
generate_data_pack()
*/
console.log(`DONE!`)

