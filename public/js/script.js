"use strict"
//Mostly JQuery code - JQuery only applies to client side code as it only interacts with a web page

//$()     ready function - place arrow function inside of brackets
$(() => {       //set up ready function - function to be automatically executed after the page has loaded - prevent click handler from loading before HTML 
    // Set up Order button handler
    $("#order").click(() => {       //use JQuery to select order button
        //JQuery for getting value of selected radio button - no need for loops
        let size = $("input[name='size']:checked").val()        //select input elements with a name of "size" and if checked get its value - can also select based on type of input
        let toppings = $("input[name='toppings[]']:checked").map(       //turn array of checkboxes into an array of values - map - apply the following function to each element in the array but preserve its structure 
            function () {
                return $(this).val()        //this - refers to an individual text box - return value found in individual check box and map it to array created by map function
            }
        ).get()     //.get() - pulls array out of map object
        let order = {       //create object containing information to be sent to the server
            size, toppings
        }

        placeOrder(order)       //placeOrder function sends order object to the server
    })
}
)

function placeOrder(order) {
    let postData = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8 ' },
        body: JSON.stringify(order)
    }
    //use fetch function by passing postdata object - send response object
    fetch('/order', postData)
        .then(response => response.json())      //extract data that was sent back from server
        .then(order => { updateForm(order) })     //pass order object to updateForm function
        .catch(err => { alert(err) })
}

function updateForm(order) {
    //alert(JSON.stringify(order))
    //orderItems is an array of objects
    let tableHead = `<tr>
                        <th colspan="3">Order Details</th>
                    </tr>
                    <tr>
                        <th>Size</th>
                        <th>Toppings</th>
                        <th>Price</th>
                    </tr>`
    $("#orderInfo").html(tableHead)

    for(var i = 0; i < order.orderItems.length; i++)
    {
        let size = `<td>${order.orderItems[i].size}</td>`
        
        if (order.orderItems[i].toppings.length == 0)
        {
            order.orderItems[i].toppings = "Cheese"
        }
        let toppings = `<td>${order.orderItems[i].toppings}</td>`

        let price = `<td>${order.orderItems[i].price}</td>`
    
        let row = `<tr>${size}${toppings}${price}</tr>`

        $("#orderInfo").append(row)
        //html += JSON.stringify(order.orderItems[i]) + "<br>"
        //$("#orderSize").text("Size: " + order.orderItems[i].size)
        //$("#orderToppings").text("Toppings: " + order.orderItems[i].toppings)
        //$("#orderPrice").text("Price: $" + order.orderItems[i].price)
    }
    //$("#orderInfo").html(html)

    //.text - plain text input into a paragraph
    //.html - string being passed has HTML tags inside of it - ex <br>
    //.append - useful for things built piece by piece - use this for assignment
    
    $("#orderTP").text("Total: " + order.totalPrice)

    /*
    const tableStyle =
    {
        "border": "solid black",
        "border-collapse": "collapse"       //enclose property in "" as it has a hyphen
    }
    const thStyle =
    {
        "border": "solid black",
        "text-align": "center"
    }
    const tdStyle =
    {
        "border": "solid black"
    }
    
    $("table").css(tableStyle)
    $("th").css(thStyle)
    $("td").css(tdStyle)
    */
}
