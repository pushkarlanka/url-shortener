/**
 * Created by pushkar on 9/12/16.
 */

function show_panels() {

    $("#panel_group").empty();
    $("#no_links").remove();

    // console.log("SESSION DATA: " +  localStorage.getItem('session_data'));
    var data = JSON.parse(localStorage.getItem('session_data'));
    if(data && data['body'] && data['body'].length > 0) {
        data = data['body'];
        var count = 0;
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
            count++;
            if(count == 7) {
                return;
            }
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
        // document.body.appendChild(div);
        document.getElementById("panel_group").appendChild(div);
    }
}

function form_handler() {
    $('#form').submit(function(event) {
        event.preventDefault();

        var $form = $( this ), target_url = $form.attr( 'action' );

        var query = $('input[name="long_link"]').val();

        if(query.length > 0) {

            var data = { long_link: query };

            $( "#form" ).submit(function() {
                var btn = $("#submit_btn");
                btn.val('Pending...');
            });

            $.ajax( {
                url : target_url,
                type: "POST",
                data: JSON.stringify(data, null, '\t'),
                contentType: 'application/json; charset=UTF-8',
                success: function(data)
                {
                    document.getElementById("form").reset();
                    document.getElementById("submit_btn").value = "SNIP";
                    var obj = JSON.parse(data);
                    // console.log(obj['short_url']);
                    // console.log(obj['long_url']);
                    // console.log(obj['title']);

                    if(obj['status'] == 400) {
                        bs_alert("Looks like the URL is invalid. Please try again.");
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
                    document.getElementById("form").reset();
                    document.getElementById("submit_btn").value = "SNIP";
                    bs_alert("Oops! Something went wrong. Please try again.");
                }
            });
        }

        return false;
    });
}

function bs_alert(text) {
    $('#alerts').html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>' + 
                            text + '</div>');
}

$(document).ready(function() {
    show_panels();
    form_handler();
});