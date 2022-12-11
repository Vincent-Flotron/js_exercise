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

        }
    };


    
    return false;
};

//#################################################################################################
// Functions
//#############################################################################################
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

function ReshapeDatas(matches){
    let values = [];
    
    for (const match of matches) {
        values.push(match[2] + match[1]);
    }
    return values;
}

// DISPLAY
function add_a_line(line) {
    document.getElementById("logs").innerHTML += "<p class=\"log-line\">" + line + "</p>";
}

// Datetime
function datetime_now(){
    return datetime_from(new Date());
}

function datetime_from(date){
    let curr_date = pad(date.getFullYear(), 4) + '-' + pad2((date.getMonth() + 1)) + '-' + pad2(date.getDate());
    let curr_time = pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds()) + "." + pad(date.getMilliseconds(), 4);
    let datetime = curr_date + ' ' + curr_time;

    return datetime;
}

// Padding
function pad2(nb){
    return pad(nb, 2);
}

function pad(nb, leading_zeros_nb){
    return ("0000" + nb).substr(-leading_zeros_nb,leading_zeros_nb);
}