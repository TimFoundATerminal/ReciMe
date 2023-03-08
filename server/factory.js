const fs = require("fs");

const db_path = "db.sqlite";

// Will check if the database exists and will delete it
try {
    if (fs.existsSync(db_path)) {
        try {
            fs.unlinkSync(db_path);
            console.log("'db.sqlite' deleted successfully")

            // Will create a blank database for the schema by copying a blank database
            try {
                fs.copyFileSync('db-blank..sqlite', db_path, fs.constants.COPYFILE_EXCL);

                // Waits a set amount of time to copy the file
                setTimeout(function() {
                    console.log("Blank copy of 'db.sqlite' created from 'db-blank..sqlite'");
                    populateDatabase();
                }, 500);


            } catch (error) {
                console.log(error);
            };
        
        } catch ( error ) {
            console.error(error);
        }
    } 
} catch (error) {
    //pass
}

const {populateDatabase} = require('./utils/factory_helpers')