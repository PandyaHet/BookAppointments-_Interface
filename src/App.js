import { BiCalendar} from  'react-icons/bi';
import { useState, useCallback, useEffect } from 'react';
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";
import AppointmentInfo from './components/AppointmentInfo';

function App() {
  let[appointmentList, setAppointmentList] = useState([]);
  let[query, setQuery] =  useState("");
  let[sortBy, setSortBy] = useState("petName");
  let[orderBy, setOrderBy] = useState("asc");

  const filteredAppointment = appointmentList.filter(
    item => {
      return(
        item.petName.toLowerCase().includes(query.toLowerCase())||
        item.ownerName.toLowerCase().includes(query.toLowerCase())||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())||
        item.aptDate.toLowerCase().includes(query.toLowerCase())
      )
    }
  ).sort((a,b) =>{
    let order = (orderBy === 'asc') ? 1  : -1;
    return(
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1*order : 1*order

    )
  })

  const fetchdata = useCallback( () =>{
    fetch('./data.json')
    .then(response => response.json())
    .then(data => 
      {setAppointmentList(data)

      });
  },[])

  useEffect( () => {
    fetchdata();
  },[fetchdata]);

  return (
    <div className="App container mx-auto mt-3 font-main m-5">
      <h1 className='text-5xl m-5'>
        <BiCalendar className='inline-block text-red-400 align-top'/>Your Apointments</h1>
        <AddAppointment 
          onSendAppointment = {myAppoinment => setAppointmentList([...appointmentList,myAppoinment])}
          lastId ={appointmentList.reduce((max,item) => Number(item.id) > max ? Number(item.id) : max, 0)}/>
        <Search query={query}
          onQueryChange={myQuery => setQuery(myQuery)}
          orderBy= {orderBy}
          onOrderByChange = {mySort => setOrderBy(mySort)}
          sortBy = {sortBy}
          onSortByChange = {mySort => setSortBy(mySort)}
          />
        <ul className='divide-y divide-gray-200 m-5'>
          {filteredAppointment
          .map(appointment => (
            <AppointmentInfo key={appointment.id} 
              appointment={appointment}
              onDeleteAppointment={
                appointmentId => 
                  setAppointmentList(prevAppointment => prevAppointment.filter(appointment => appointment.id  !== appointmentId))} 
            />

          ))}
        </ul>
    </div>
  );
}

export default App;
