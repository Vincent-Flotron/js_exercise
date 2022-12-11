//#################################################################################################
// Main
//#############################################################################################
// DRAG AND DROP
var holder = document.getElementById('holder'),
    state = document.getElementById('status');

if (typeof window.FileReader === 'undefined') {
    state.className = 'fail';
} else {
    state.className = 'success';
    state.innerHTML = 'File API & FileReader available';
}

// Insert p to holder
var innerdiv = document.createElement('p');
holder.appendChild(innerdiv);

holder.ondragover = function () { holder.classList.add('hover'); return false; };
holder.ondragend = function () { holder.classList.remove('hover'); return false; };
holder.ondrop = function (e) {
    // 
    holder.classList.remove('hover');
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function (event) {
        innerdiv.innerText = "file \"" + file.name + "\" received.";
    };
    Print("Started.");

    /* (1) */
    // Open and read all the file
    Print("Read the input file \"" + file.name + "\".")

    let outputpath = "Output.txt";

    // Print(reader.result);
    reader.readAsText(file);

    reader.onloadend = () => {
        if(reader.result == null){
            Print("Error when reading the file \"" + file.name + "\"");
        }
        else{
            /* (2) */
            let strt = new Date();  // to measure the time
            Print("Start measuring the time at " + datetime_from(strt) + ".");
            
            // Extract the datas from the input file
            Print("Extract the datas.");
            let matches = ExtractDatasFromString(reader.result);

            // Reshape the datas
            Print("Reshape.");
            let values = ReshapeDatas(matches);
            
            // Sort the datas
            Print("Sort.");
            values.sort();
            values.reverse();
            
            // Measure the time used for the step 2         
            let dt = Math.abs((new Date()) - strt);
            Print("Stop measuring the time. dt: " + millisecs_to_hhMMss(dt));
   
            /* (3, 4) */
            // Write the ouptut file
            Print("Write the output file \"" + outputpath + "\".");
            WriteFile(outputpath, values, dt);
        }
    };


    
    return false;
};

//#################################################################################################
// Functions
//#############################################################################################
/* Sleep function
*   Usage:
*       sleep(time_in_ms).then(() => { your code ...  });   */         
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function Print(message){
    add_a_line(datetime_now() + ": " + message);
}

function ExtractDatasFromString(content){
    // const reg = /"(?:\"PA)(?<postnb>\\d+?)(?::proALPHA:)(?<nb>[^\":\\r\\n]+)(?:\")"/gi;
    // const reg = /(?:"PA)(\d+?)(?::proALPHA:)([^":\r\n]+)(?:")/gi;
    // const reg = /(?::proALPHA:)([^":\r\n]+)(?:")/gi;
    const reg = /(?:"PA)(\d+?)(?::proALPHA:)([^":\r\n]+)(?:")/gi;
    let matches = content.matchAll(reg);

    return matches;
}

function WriteFile(filename, values, dt){
    let time_cost = millisecs_to_hhMMss(dt);

    let all_txt = "Zeit " + time_cost + "\r\n";
    for(line of values){
        all_txt += line + "\r\n";
    }
    download(filename, all_txt);
    // var content = "What's up , hello world";
    // // any kind of extension (.txt,.cpp,.cs,.bat)
    // var filename = filename;
    
    // var blob = new Blob([content], {
    //  type: "text/plain;charset=utf-8"
    // });
    
    // saveAs(blob, filename);
}

function ReshapeDatas(matches){
    let values = [];
    
    for (const match of matches) {
        values.push(match[2] + match[1]);
    }
    return values;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

// Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

// DISPLAY
function add_a_line(line){
    document.getElementById("logs").innerHTML += "<p class=\"log-line\">" + line + "</p>";
}

// Datetime
function datetime_now(){
    return datetime_from(new Date());
}

function datetime_from(date){
    let curr_date = pad_leading0(date.getFullYear(), 4) + '-' + pad2l((date.getMonth() + 1)) + '-' + pad2l(date.getDate());
    let curr_time = pad2l(date.getHours()) + ":" + pad2l(date.getMinutes()) + ":" + pad2l(date.getSeconds()) + "." + pad4t(date.getMilliseconds());
    let datetime = curr_date + ' ' + curr_time;

    return datetime;
}

function millisecs_to_hhMMss(milliseconds){
    var date = new Date(milliseconds-3600*1000);

    let curr_time = pad2l(date.getHours()) + ":" + pad2l(date.getMinutes()) + ":" + pad2l(date.getSeconds()) + "." + pad4t(date.getMilliseconds());

    return curr_time;
}

// Padding
function pad2l(nb){
    return pad_leading0(nb, 2);
}

function pad_leading0(nb, leading_zeros_nb){
    return ("0000" + nb).substr(-leading_zeros_nb,leading_zeros_nb);
}

function pad4t(nb){
    return pad_trailing0(nb, 4);
}

function pad_trailing0(nb, trailing_zeros_nb){
    return (nb + "0000").substr(0,trailing_zeros_nb);
}