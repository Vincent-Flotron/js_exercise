// DISPLAY
function greet() {
    console.log('Hey there clicker!');
}

function add_a_line(line) {
    document.getElementById("logs").innerHTML += "<p class=\"log-line\">" + line + "</p>";
}

function Print(message){
    add_a_line(datetime_now() + ": " + message);
}

// DATE
function datetime_now(){
    let current = new Date();
    let curr_date = pad(current.getFullYear(), 4) + '-' + pad2((current.getMonth() + 1)) + '-' + pad2(current.getDate());
    let curr_time = pad2(current.getHours()) + ":" + pad2(current.getMinutes()) + ":" + pad2(current.getSeconds()) + "." + pad(current.getMilliseconds(), 4);
    let datetime = curr_date + ' ' + curr_time;

    return datetime;
}

// PAD
function pad2(nb){
    return pad(nb, 2);
}

function pad(nb, leading_zeros_nb){
    return ("0000" + nb).substr(-leading_zeros_nb,leading_zeros_nb);
}

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
    };

    /* (2) */

    
    
    return false;
};

