/**
 * Created by pushkar on 9/12/16.
 */

function show_panels() {

    $("#panel_group").empty();
    $("#no_links").remove();

    console.log("SESSION DATA: " +  localStorage.getItem('session_data'));
    var data = JSON.parse(localStorage.getItem('session_data'));
    if(data && data['body'] && data['body'].length > 0) {
        data = data['body'];
        for(var i = data.length - 1; i >= 0; i--) {
            var item = data[i];

            var panel = document.createElement('div');
            panel.className = "panel panel-primary";

            var panel_heading = document.createElement('div');
            panel_heading.className = "panel-heading";
            panel_heading.textContent = item['title'];

            var panel_body = document.createElement('div');
            panel_body.className = "panel-body";
            var short_url = document.createElement('a');
            short_url.href = item['short_url'];
            short_url.text = item['short_url'];
            panel_body.appendChild(short_url);

            panel.appendChild(panel_heading);
            panel.appendChild(panel_body);
            document.getElementById("panel_group").appendChild(panel);
        }
    } else {
        var div = document.createElement('div');
        div.className = 'text-center';
        div.style = 'padding-top: 10%';
        div.id = 'no_links';
        var text = document.createElement('strong');
        text.style = 'color: grey; font-size: 30px;';
        text.textContent = "No links to show";
        div.appendChild(text);
        document.body.appendChild(div);
    }
}

function form_handler() {
    $('#form').submit(function(event) {
        console.log('I MADE IT');
        event.preventDefault();

        var $form = $( this ), target_url = $form.attr( 'action' );

        var query = $('input[name="long_link"]').val();

        if(query.length > 0) {

            data = { long_link: query };

            $.ajax( {
                url : target_url,
                type: "POST",
                data: JSON.stringify(data, null, '\t'),
                contentType: 'application/json; charset=UTF-8',
                success: function(data)
                {
                    var obj = JSON.parse(data);
                    console.log(obj['short_url']);
                    console.log(obj['long_url']);
                    console.log(obj['title']);

                    if(obj['status'] == 400) {
                        alert('failure!');
                    } else {
                        console.log("LOOK" + data);
                        // initialize local storage if NULL
                        var session_data;
                        if(localStorage.getItem('session_data') == null) {
                            session_data = {'body': []};
                        } else {
                            session_data = JSON.parse(localStorage.getItem('session_data'));
                        }

                        session_data['body'].push(obj);
                        localStorage.setItem('session_data', JSON.stringify(session_data));
                        show_panels();
                    }
                },
                error: function()
                {
                    alert('failure!');
                }
            });
        }

        return false;
    });
}

$(document).ready(function() {
    show_panels();
    form_handler();
});