import Noty from 'noty';  
import "../../node_modules/noty/lib/noty.css";
import "../../node_modules/noty/lib/themes/mint.css";

/* 
Noty notifications class that creates a new notification 
using 1 parameter for buttonless notifications and
3 for notifications with buttons
*/
const newNotification = (text, type = "alert", execFunction) => {
    if(type === "alert"){
        return new Noty({  
            text: `${text}`,
            layout: "bottomRight",
            type: "alert",
            timeout: 3500,
            progressBar: false,
            closeWith: ["click", "button"]
        }).show()
    }else if(type === "confirm"){
        const notif = new Noty({  
            text: `${text}`,
            layout: "bottomRight",
            buttons: [
                Noty.button('YES', 'btn btn-success', () => execFunction(notif)),
                Noty.button('NO', 'btn btn-error', function () {notif.close()})
                ]
        }).show()
        return notif
    }else if(type === "intro"){
        return new Noty({  
            text: `${text}`,
            layout: "topCenter",
            type: "error",
            timeout: 3000,
            progressBar: true,
            closeWith: ["click", "button"]
        }).show()
    }

}

export default newNotification