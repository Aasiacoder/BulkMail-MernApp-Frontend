import {useState} from 'react';
import axios from 'axios'
import * as XLSX from 'xlsx'//* as XLSX means you didn't use only xlsx function instead apply all xlsx function here. now it will work

function App() {

  const [message, setmessage] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handleMessage(e){// when textarea msg was onChanged it will stored in message useState variable
    setmessage(e.target.value)
  }

  function handlefile(event){
    const file = event.target.files[0]
    // console.log(file);

    const reader = new FileReader();// i want to read files so i use FileReader object here
    // If the file is loading, then when you click on the file reader, it will take the selected Excel file and load the data inside
    reader.onload = function (e) {
        // console.log(e); //1st choose file btn click and select excel file,here i get file (check console)

        const data = e.target.result;
        // console.log(data); //check console now more words are showing but it not a readable format coz it is binary format

        //now i change excel file data in readable format
        const workbook = XLSX.read(data, { type: 'binary' })//XLSX.read(data,)data-> cannot read the data, it means the file is in binary format. So, I will read the binary file as an XLSX file. Since the data type is binary, I specify { type: "binary" }.
        // I have already used the XLSX library from the CDN in HTML, and I will use the same here as well
        
        // console.log(workbook);
        
        const sheetName = workbook.SheetNames[0]// inside the workbook have SheetNames[0] and its 0th index
        
        const worksheet = workbook.Sheets[sheetName]
        // console.log(worksheet); // here i got the actuall excel sheet data,here i change format in json array
        
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})//utils la sheet_to_json is a function (here i put worksheet,{here which one is called header A i selected it here particularly, coz it have that excel file particular mail id})
        // console.log(emailList); // here i had a array in that array have 2 emails
       
        const totalemail = emailList.map(function(item){return item.A}) // item is email and .A means perticular A value only i want
        // console.log(totalemail);
        
        setEmailList(totalemail)
    }

    reader.readAsBinaryString(file); // Excel is in binary format. it will only readable in binary format

  }

  // when i click "Send" btn i want to send textarea msg to backend 
  function send(){ // here i use axios to send req in "/sendemail"(page),{msg:message} What message will be sent? The message(variable) value
    // default axios is get
    setstatus(true) // when btn click btn status was change into sending
    axios.post("http://localhost:5000/sendemail",{msg:message,emailList:emailList}) 
    // The request will go to the send email page along with the message and emailList
    .then(function(data){
      if(data.data === true){
        alert("Email sent Successfully")
        setstatus(false)
      }else{
        alert("Failed to Load")
      }
    })
  }

  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handleMessage} value={message} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text... "></textarea>

        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
        </div>

        <p>Total Emails in th file: {emailList.length}</p> {/*how many email have in emailList it will shown */}

        <button onClick={send} className="bg-blue-950 py-2 px-2 mt-2 text-white font-medium rounded-md w-fit">{status?"Sending...":"Send"}</button>

      </div>

      <div className="bg-blue-300 text-white text-center p-8">
      </div>

      <div className="bg-blue-200 text-white text-center p-8">
      </div>

    </div>
  );
}

export default App;
