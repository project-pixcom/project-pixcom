$(document).ready(function () {
var transcript="";
var form = document.getElementById('new-app');
var  app_save= document.getElementById('app-save');
var currentDate = new Date();
   cDate=currentDate.getDate();
window.SpeechRecognition = window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
val=1;
micon=document.getElementById("mic-on");
micoff=document.getElementById("mic-off");
micon.addEventListener("click", () => {
  recognition.removeEventListener('result', resultEventListener);
  recognition.removeEventListener('end', endEventListener);
  micon.style.display="none";
  micoff.style.display="block"; 
});
micoff.addEventListener("click", () => {
  micoff.style.display="none";
  micon.style.display="block";
  recognition.addEventListener('result', resultEventListener);
  recognition.addEventListener('end', endEventListener);
  
  if(val==1){
    val=2;
  connect_todialogflow("knowaboutpage");
  }
  else{
    recognition.start();
  }

});
async function speakText(text) {
  console.log(text);
  var synth = window.speechSynthesis;
  var utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
  return true;
  }
const resultEventListener = e => {
  transcript = Array.from(e.results)
     .map(result => result[0])
     .map(result => result.transcript)
     .join('')

 console.log(transcript);
};

const endEventListener = async e => {
  
if(!transcript==""){
  if (transcript.includes("hey spot")) {
    transcript=transcript.replace("hey spot","");
    if(transcript==""){
    connect_todialogflow("hey spot");
    }
    else{
      connect_todialogflow(transcript);
    }
  }
    else if (transcript.includes("spot")) {
        transcript=transcript.replace("spot","");
        if(transcript==""){
        connect_todialogflow("hey spot");
        }
        else{
          connect_todialogflow(transcript);
        }
    }
  else{
    recognition.start();
  }
}
else{
  recognition.start();
}
};


async function connect_todialogflow(request) {
    console.log(request);
    transcript="";
    var url = '/dialog';
    var data = {
        text: request
    };
    var headers = {
        'Content-Type': 'application/json'
    };

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            var error="Something went  wrong say that again";
          speakText(error);
          
        }
          return response.json()
              .then(data => {
                  console.log(data);
                   if(data.intent_name=="Default Fallback Intent" || data.intent_name=="Welcome Intent" || data.intent_name=="knowaboutpage" || data.intent_name=="hey-spot" ){
                     speakText(data.fullfilment_text);
                   }
                  else if(data.intent_name=="date-picker"){
                    cDate=data.cdate;
                    $('#monthSelector').val(data.cmonth-1);
                    $('#yearSelector').val(data.cyear);
                    buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
                  }
                else if (data.intent_name=="new-app"){
                  speakText(data.fullfilment_text);
                  document.querySelector(".add-event-form").style.display ="flex";          document.querySelector("body").style.overflow="hidden";
                }
                else if(data.intent_name=="exit-app"){
                  document.querySelector(".add-event-form").style.display ="none";
                  document.querySelector("body").style.overflow="auto";
                }
                else if(data.intent_name="app-save"){
                      app_save.click();
                }
                recognition.start();
              });
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Propagate the error
    });

}

   
        // Function to get the number of days in a month
        function daysInMonth(month, year) {
            console.log(month,year);

            return new Date(year, month+1, 0).getDate();
        }
        function build_calendar(month,year){
          document.querySelector(".add-event-form").style.display ="none";
          document.querySelector("body").style.overflow="auto";

            var firstDay = new Date(year, month, 1).getDay();
            var days = daysInMonth(month, year);
            console.log(days,cDate);
            var date = 1;

            // Clear the previous content of the tbody
            $('#calendar1 tbody').empty();

            for (var i = 0; i < 6; i++) {
                var row = $('<tr class="rd-days-row"></td>');

                for (var j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        // Add empty cells for days before the first day of the month
                        row.append('<td></td>');
                    } else if (date > days) {
                        // Break the loop if we have reached the end of the month
                        break;
                    } else {
                        // Add a cell with the current date

                        if(cDate==date){
                        row.append('<td class="rd-day-body selected-date">' + date + '</td>');
                            console.log("current");
                    }
                        else{
                            row.append('<td class="rd-day-body ">' + date + '</td>');
                        }
                        date++;
                    }
                }

                $('#calendar1 tbody').append(row);
            }
        }
        // Function to build the calendar grid
        async function buildCalendar(month, year) {
            try {
                // Make an asynchronous call to Dialogflow
                const dialogflowResponse = await get_appointment();

                // Assuming the Dialogflow response contains a date value
                

                // Build the calendar using the retrieved date
                build_calendar(month, year);

                // Further processing of the Dialogflow response or calendar if needed
                console.log('Dialogflow response:', dialogflowResponse);
            } catch (error) {
                console.error('Error building calendar with Dialogflow:', error);
            }
        } 
  
  function get_appointment() {
    const requestData = {
      text: `${$('#yearSelector').val()}-${parseInt($('#monthSelector').val())+1}-${cDate}`
    };

    const url = '/get_records';

    // Make a POST request to Flask
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); 
      })
      .then(html => {
        
        document.getElementById('ev-contents').innerHTML = html;
      })
      .catch(error => {
        console.error('Error fetching records:', error);
      });
  }

        // Populate the year selector with a range of years
        var currentYear = new Date().getFullYear();
        var currentMonth=new Date().getMonth();
        
        for (var i = currentYear - 10; i <= currentYear + 1; i++) {
            $('#yearSelector').append('<option value="' + i + '">' + i + '</option>');
        }

        // Set the initial selected year
        $('#yearSelector').val(currentYear);
        $('#monthSelector').val(currentMonth);
        // Initial calendar display

        buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());

        // Event listener for clicking on a date cell
        $('#calendar1 tbody').on('click', 'td', function () {
            cDate=$(this).text();
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());

        });

        // Event listener for changing the month and year
        $('#prevMonth').on('click', function () {
            console.log("clicked");
            currentDate.setMonth(currentDate.getMonth() - 1);
            $('#monthSelector').val(currentDate.getMonth());
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });

        $('#nextMonth').on('click', function () {
            console.log("clicked");
            currentDate.setMonth(currentDate.getMonth() + 1);
            $('#monthSelector').val(currentDate.getMonth());
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });

        $('#yearSelector').on('change', function () {
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });
        $('#monthSelector').on('change', function () {
            buildCalendar(parseInt($('#monthSelector').val()), $('#yearSelector').val());
        });
  app_save.addEventListener('click', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Check if all required fields are filled
    if (form.checkValidity()) {
      // If all fields are filled, submit the form
        form.submit();
      console.log("Form submitted");
    } else {
      // If not all fields are filled, trigger the default button click behavior
      console.log("Form not valid");
          
      speakText("Enter Valid data");
      // If there's a button associated with the form, you can click it
      // Alternatively, you might want to display an error message or highlight the unfilled fields.
    }
  });
    });

