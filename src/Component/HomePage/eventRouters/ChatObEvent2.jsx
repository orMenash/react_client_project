import React from "react";
import axios from "../../../Util/axios";
import { useCookies } from "react-cookie";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Chat1 from "../../chat/Chat1";
import Chat2 from "../../chat/Char2";

const socketIOClient = io("localhost:3010");

export default (props) => {
  const navigate = useNavigate();
  const { eventClick } = props;

  React.useEffect(() => {
    const { eventClick } = props;
    console.log(eventClick);
    socketIOClient.on(
      "live On React",
      (message, UserName, idEvent, timeMass) => {
        if (idEvent === eventClick.NameEvent) {
          setMgs((current) => [
            ...current,
            { messages: message, from: UserName, timeMass: timeMass },
          ]);
        }
      }
    );
  }, []);

  const [cookiesUserName, setcookiesUserName] = useCookies(["UserName"]);

  const refValue = React.useRef();
  const [arrMes, setMgs] = React.useState([]);

  async function getData() {
    if (props.eventClick) {
      const status200 = await axios.Post(
        "http://localhost:3010/event/EventChat",
        { IdEvent: eventClick.NameEvent }
      );
      // console.log(status200);
      setMgs(status200.data.TakeIt[0].EventMessages);
    }
  }

  async function sendComm() {
    const d = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds(),
        new Date().getMilliseconds()
      )
    );
    let text = d.toISOString();
    socketIOClient.emit(
      "live On",
      refValue.current.value,
      cookiesUserName.UserName,
      eventClick.NameEvent,
      text
    );
    const status200 = await axios.Post(
      "http://localhost:3010/event/EventChat",
      {
        IdEvent: eventClick.NameEvent,
        from: cookiesUserName.UserName,
        messages: refValue.current.value,
      }
    );
  }

  React.useEffect(() => {
    getData();
  }, []);

  if (props.eventClick) {
    return (
      <>
        <ol style={{ display: "flex", flexDirection: "column" }} dir="rtl">
        <div className="fixedContainer">
            <div id="h4_ChatObEvent">
              <h6>{props.eventClick.NameEvent}</h6>
              <h6>{props.eventClick.Date.slice(0, 10)}</h6>
            </div>
          </div>
          {arrMes.map((item, index) => {
            // console.log(props.eventClick.Active == true);
            if (item.from) {
              if (cookiesUserName.UserName == item.from) {
                return (
                  <Chat1
                    key={index}
                    text={item.messages}
                    time={
                      item.timeMass.substring(0, 10) +
                      " " +
                      item.timeMass.substring(11, 19)
                    }
                    from={item.from}
                  />
                );
              } else if (cookiesUserName.UserName !== item.from) {
                return (
                  <Chat2
                    key={index}
                    text={item.messages}
                    time={
                      item.timeMass.substring(0, 10) +
                      " " +
                      item.timeMass.substring(11, 19)
                    }
                    from={item.from}
                  />
                );
              }
            } else {
              return <p>אין תגובות עדיין !</p>;
            }
          })}
        </ol>
        {props.eventClick.Active && (
          <div id="inputSendComm">
            <label htmlFor="Ab">
              שלח תגובה ..
              <input type="text" name="Ab" ref={refValue} />
            </label>
            <button
              onClick={() => {
                sendComm();
                refValue.current.value = "";
              }}
            >
              תגובה{" "}
            </button>
          </div>
        )}
        {/* </Paper>
  </Box> */}
      </>
    );
  } else {
    navigate("");
  }
};
