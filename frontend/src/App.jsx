import { useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"

const URL = import.meta.env.VITE_API_BACKEND

const App = () => {
  const [message, setmessage] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist,setemailist]=useState([])
  const handlemsg = (e) => {
    setmessage(e.target.value)
  }
  const send = () => {
    setstatus(true)
    axios.post(`${URL}/sendemail`, { message: message,emaillist:emaillist })
      .then(function (data) {
        if (data.data === true) {
          setstatus(false)
          alert("Mail sended successfully")
        }
        else {
          alert("Try again")
        }
      })
 }
 const handleemail=(event)=>{
    const file = event.target.files[0]
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = event.target.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetname = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetname]
        const emaillist = XLSX.utils.sheet_to_json(worksheet, {header:"A"})
        const totalemail = emaillist.map(function(item){
          return item.A
        })
        console.log(totalemail)
        setemailist(totalemail)

    }

    reader.readAsBinaryString(file)
}
  return (<>
    <div>
      <div className="bg-blue-950 text-white  text-center py-3">
        <h1 className="text-4xl">Bulkmail</h1>
      </div>
      <div className="bg-blue-800 text-white  text-center py-3">
        <p className="">We can help business with sending mails at once </p>
      </div>
      <div className="bg-blue-600 text-white  text-center py-3">
        <p>Drag and Drop</p>
      </div>
      <div className="bg-blue-500 text-center py-3 ">
        <textarea onChange={handlemsg} className="w-[80%] h-32 outline-none rounded-md p-5 " placeholder="Enter the e-mail text ..."></textarea>
      </div>
      <div className="bg-blue-400 text-center py-3 ">
        <input onChange={handleemail} type="file" id="fileinput" className="border-4 border-dashed p-5" />
        <p className="mt-5">Total Emails in the files : {emaillist.length}  </p>
        <button onClick={send} className="bg-blue-950 p-2 rounded-md text-white mt-5">{status ? "sending..." : "send"}</button>
      </div>
      <div className="bg-blue-300 p-8">

      </div>
      <div className="bg-blue-200 p-6">

      </div>
    </div>
  </>)

}
export default App