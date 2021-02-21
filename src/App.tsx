import React, {  useRef, useState } from 'react';
import './App.css';
import profiles from './mockdata.json';
import CardItem from './components/CardItem';
import cross from './assets/cross.png'
import acceptedIcon from './assets/accepted.png'
import rejectedIcon from './assets/rejected.png'
import tick from './assets/tick.png'
import mission from './assets/mission.png'

interface Profile {
  name: string;
  age: number;
  description: string;
  image: string;
}


function App() {
  const [stack, setStack] = useState<Array<Profile>>(profiles);
  const [accepted, setAccepted] = useState<Array<Profile>>([]);
  const [rejected, setRejected] = useState<Array<Profile>>([]);
  const [likeState, setLikeState] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true)
  const counter = useRef(0)

  const handleReject = () => {
    setLikeState("reject")
  }

  //triggered if button pressed instead  
  const handleAccept = () => {
    setLikeState("like")
  }

  //Updates Stack and stores swipe result
  const handleSwipeResult = (profile : Profile, result : boolean) => {
    // console.log(profile, result, "PROF")
    let updatedStack : Array<Profile> = stack.filter((prof, i) => {
      return (
        i < stack.length - 1
        )
      })
      if(stack.length - 1 === updatedStack.length){
        if(result){
          setAccepted([ ...accepted, profile])
        } else if (result === false) {
          setRejected([ ...rejected, profile])
        }
        setStack(updatedStack)
        setLikeState("")
      }
      
    };
    
    const renderStack = stack.map((profile, i) => {
      let topCard : boolean = i === stack.length - 1;
      
    return (
      <CardItem drag={topCard} profile={profile} handleSwipeResult={handleSwipeResult} key={i} likeState={likeState} setLoading={setLoading} loading={loading} counter={counter} length={profiles.length}/>
    )
  }) 

  //RESET ALL STATE
  const handleReset = () => {
    setLoading(true)
    counter.current = 0;
    setStack(profiles);
    setRejected([]);
    setAccepted([]);
    setLikeState("")
  }

  return (
    <div className="App">
      <div className="frame" style={{display : `${loading ? "none": "flex"}`}}>
        <img src={mission} alt="logo" className="mission-logo"></img>
        {renderStack}
        {!stack.length && 
        <div className="results-wrap">
        <h1 className="results-header">RESULTS</h1>
        <div className="table-wrap">
        <div className="rejected">
          <img src={rejectedIcon} alt="rejected" className="results-icon"></img>
          {rejected.map((reject) => {
            return (
              <h1>{reject.name}</h1>
            )
          })}
        </div>
        <div className="accepted">
          <img src={acceptedIcon} alt="accepted" className="results-icon"></img>
          {accepted.map((accept) => {
            return (
              <h1>{accept.name}</h1>
            )
          })}
        </div>
        </div>
          <button className="again-button" onClick={handleReset}>Start Again 🔄</button>
        </div>
        }
        {!!stack.length && <div className="button-wrap">
          <button className="button" onClick={handleReject}><img src={cross} alt="cross" className="button-image" /></button>
          <button className="button" onClick={handleAccept}><img src={tick} alt="tick" className="button-image" /></button>
      </div>}
      </div>
      <div className="frame" style={{ display: `${!loading ? "none" : "flex"}` }}>
        <img src={mission} alt="logo" className="mission-logo"></img>
        <div className="spinner"/>
      </div>
    </div>
  );
}

export default App;
