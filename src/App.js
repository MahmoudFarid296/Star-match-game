import React from "react";
import { useRef, useState, useEffect } from "react";
import star from "./star.jpeg";
// --------------------------------------------------------------------------------------------------------------------
const filter = (arr) => {
  // function to filter repeated values from an array which we use to filter values of possible values of stars
  return arr.filter((item, index) => arr.indexOf(item) === index);
};
// --------------------------------------------------------------------------------------------------------------------
function Game() {
  const originalCol = { backgroundColor: "rgb(230, 230, 230)" }; // original background color of buttons
  const [render, setRender] = useState(true); // render is only a toggler to re-render the node
  const [endGame, setEndGame] = useState(false); // a flag to indicat if the game is ended by winning or losing or not
  const [timer, setTimer] = useState(10); // set game timer
  const randomValue = useRef(Math.ceil(Math.random() * 9)); // picking a random value between 1 and 9 to display stars upon later it will be picked from array of possible values
  const availableButtons = useRef([1, 2, 3, 4, 5, 6, 7, 8, 9]); // available unpressed buttons
  const buttonsDisability = useRef([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]); // array of flags to indicate which button is disabled and which is not
  const colors = useRef([
    originalCol,
    originalCol,
    originalCol,
    originalCol,
    originalCol,
    originalCol,
    originalCol,
    originalCol,
    originalCol,
  ]); // array of colors of each button

  function buttonsDisable(x) {
    buttonsDisability.current[x] = true;
  }

  function buttonsEnable(x) {
    buttonsDisability.current[x] = false;
  }

  function changeColor(x, newColor) {
    colors.current[x] = newColor;
    setRender(!render);
  }

  function startAgain() {
    setTimeout(() => {
      // a function to reset all the values to initial values and start a new gam which is triggered by play again button
      availableButtons.current = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      buttonsDisability.current = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];
      colors.current = [
        originalCol,
        originalCol,
        originalCol,
        originalCol,
        originalCol,
        originalCol,
        originalCol,
        originalCol,
        originalCol,
      ];
      randomValue.current = Math.ceil(Math.random() * 9);
      setEndGame(false);
      setTimer(10);
    }, 300);
  }

  function calcPossValues() {
    // function to deduct the pressed button from available buttons array, recalculate possible values, pick a new random value and check if that was the las available button
    availableButtons.current.splice(
      availableButtons.current.indexOf(randomValue.current),
      1
    ); // deducting the value of pressed button
    let possValues = []; // array of possible values calculated according to left unpressed buttons
    for (let i = 0; i < availableButtons.current.length; i++) {
      // nested loop to calculate possible values of each button and their addition with each other button with upper limit of 9
      possValues.push(availableButtons.current[i]);
      for (let j = i + 1; j < availableButtons.current.length; j++) {
        if (availableButtons.current[i] + availableButtons.current[j] <= 9) {
          possValues.push(
            availableButtons.current[i] + availableButtons.current[j]
          );
        }
      }
    }
    possValues = filter(possValues);
    randomValue.current =
      possValues[Math.floor(Math.random() * possValues.length)];
    if (availableButtons.current[0] === undefined) {
      setEndGame(true);
    }
  }

  function calcPossValuesCase2(x, y) {
    // same as above function but for 2 buttons
    availableButtons.current.splice(availableButtons.current.indexOf(x), 1);
    availableButtons.current.splice(availableButtons.current.indexOf(y), 1);
    let possValues = [];
    for (let i = 0; i < availableButtons.current.length; i++) {
      possValues.push(availableButtons.current[i]);
      for (let j = i + 1; j < availableButtons.current.length; j++) {
        if (availableButtons.current[i] + availableButtons.current[j] <= 9) {
          possValues.push(
            availableButtons.current[i] + availableButtons.current[j]
          );
        }
      }
    }
    possValues = filter(possValues);
    randomValue.current =
      possValues[Math.floor(Math.random() * possValues.length)];
    if (availableButtons.current[0] === undefined) {
      setEndGame(true);
    }
  }

  useEffect(() => {
    const timerClock = () => {
      // function to deduct from the value of timer every second
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    };
    if (timer > 0 && endGame === false) {
      // at end of each render check if the timer is not = 0  and the flag of end game is still indicating that game is still runing deduct 1 from timer
      // timerClock();
    } else {
      // else stop the timer ,disable all the buttons and set the end game flag to true.
      clearTimeout(timerClock);
      buttonsDisability.current = [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ];
      setEndGame(true);
    }
  }, [timer, endGame]);
  return (
    <div className="parent">
      <div style={{ fontSize: "30px" }}>
        Welcome to the stars game : pick 1 or 2 buttons evaluating the number of
        stars{" "}
      </div>
      <div className="mainVessel">
        <LeftPart
          randomValue={randomValue.current}
          timer={timer}
          again={startAgain}
        />
        <RightPart
          numberOfStars={randomValue.current}
          calcPossValues={calcPossValues}
          calcPossValuesCase2={calcPossValuesCase2}
          endGame={endGame}
          buttonsDisable={buttonsDisable}
          buttonsEnable={buttonsEnable}
          buttonsDisability={buttonsDisability.current}
          colors={colors.current}
          changeColor={changeColor}
        />
      </div>
      <div style={{ fontSize: "30px" }}>Remaining time : {timer} seconds</div>
    </div>
  );
}
// --------------------------------------------------------Left Part------------------------------------------------------------
function LeftPart(props) {
  const availableStars = Array.from({ length: props.randomValue }, (_, i) => (
    <Stars key={i} />
  ));

  if (props.randomValue !== undefined && props.timer > 0) {
    return <div className="leftPart">{availableStars}</div>;
  } else if (props.randomValue === undefined) {
    return (
      <div className="leftPart">
        <div style={{ color: "green", fontSize: "30px" }}>You Won</div>
        <button
          style={{ width: "auto" }}
          onClick={() => {
            props.again();
          }}
        >
          Play again
        </button>
      </div>
    );
  } else if (props.timer === 0) {
    return (
      <div className="leftPart">
        <div style={{ color: "red", fontSize: "30px" }}>You Lost</div>
        <button
          style={{ width: "auto" }}
          onClick={() => {
            props.again();
          }}
        >
          Play again
        </button>
      </div>
    );
  }
}

function Stars() {
  return (
    <>
      <img alt="not found" src={star} />
    </>
  );
}
// --------------------------------------------------------Right Part------------------------------------------------------------
function RightPart(props) {
  const [tempButton, setTempButton] = useState(0); //temporary variable to carry the value of pressed button if it's value is less than displayed stars

  function check(x) {
    // x refers to the pressed button value
    if (tempButton === 0) {
      if (x === props.numberOfStars) {
        props.buttonsDisable(x - 1);
        props.changeColor(x - 1, { backgroundColor: "green" });
        props.calcPossValues();
      } else if (x < props.numberOfStars) {
        props.buttonsDisable(x - 1);
        props.changeColor(x - 1, { backgroundColor: "blue" });
        setTempButton(x);
      } else {
        props.buttonsDisable(x - 1);
        props.changeColor(x - 1, { backgroundColor: "red" });
        setTempButton(1); // dummy toggle just to re-render but it is not affecting flow logic of the game
        setTimeout(() => {
          props.buttonsEnable(x - 1);
          props.changeColor(x - 1, { backgroundColor: "rgb(230, 230, 230)" });
          setTempButton(0); // reversing the dummy toggle
        }, 100);
      }
    } else {
      if (x + tempButton === props.numberOfStars) {
        props.buttonsDisable(x - 1);
        props.changeColor(x - 1, { backgroundColor: "green" });
        props.changeColor(tempButton - 1, { backgroundColor: "green" });
        props.calcPossValuesCase2(x, tempButton);
        setTempButton(0);
      } else {
        props.buttonsEnable(tempButton - 1);
        props.changeColor(x - 1, { backgroundColor: "red" });
        props.changeColor(tempButton - 1, { backgroundColor: "red" });
        setTimeout(() => {
          props.changeColor(x - 1, { backgroundColor: "rgb(230, 230, 230)" });
          props.changeColor(tempButton - 1, {
            backgroundColor: "rgb(230, 230, 230)",
          });
          setTempButton(0);
        }, 100);
      }
    }
  }
  if (props.endGame === true && tempButton !== 0) {
    // to check if game was ended and a buttons was pressed and saved in the temporary button memory ,clear it and recover the color to default color
    props.changeColor(tempButton - 1, {
      backgroundColor: "rgb(230, 230, 230)",
    });
    setTempButton(0);
  }

  const renderedButtons = Array.from({ length: 9 }, (_, i) => (
    <Button
      key={i + 1}
      buttonId={i + 1}
      check={check}
      disability={props.buttonsDisability[i]}
      color={props.colors[i]}
    />
  ));
  return <div className="rightPart">{renderedButtons}</div>;
}

function Button(props) {
  return (
    <button
      className="numbers-buttons"
      style={props.color}
      disabled={props.disability}
      onClick={(e) => {
        e.preventDefault();
        props.check(props.buttonId); // to check pressed button in comparison to displayed stars
      }}
    >
      {props.buttonId}
    </button>
  );
}

export default Game;
