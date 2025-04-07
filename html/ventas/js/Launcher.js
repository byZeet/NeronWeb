//Vendor
import $ from "lib/jquery/jquery.min.js";

import App from "./app/App.js";

function launch(){
    $("body").on("contextmenu", e => false);
    new App().launch();
}

launch();