import Noty from 'noty';  
import "../../node_modules/noty/lib/noty.css";
import "../../node_modules/noty/lib/themes/mint.css";

const newNotification = (text, type = "alert", execFunction) => {
    if(type === "alert"){
        return new Noty({  
            text: `${text}`,
            layout: "bottomRight",
            type: "alert",
            timeout: 5000,
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
    }

}

export default newNotification