import React, { useRef, useEffect, useState } from "react";
import { useAnimation, useMotionValue, motion } from "framer-motion";
import "./CardItem.css";
import reject from "../assets/reject.png";
import pass from "../assets/pass.png";

interface Profile {
  name: string;
  age: number;
  description: string;
  image: string;
}

const CardItem = ({
  profile,
  handleSwipeResult,
  drag,
  likeState,
  setLoading,
  counter,
  length,
  loading,
}: {
  likeState: string;
  profile: Profile;
  drag: boolean;
  handleSwipeResult: Function;
  loading: boolean;
  setLoading: Function;
  length: number;
  counter: any;
}) => {
  const cardEl: any = useRef(null);
  const x = useMotionValue(0);
  const control = useAnimation();
  const [initialPosition, setInitialPosition] = useState<number>(0);
  const [shiftedPosition, setShiftedPosition] = useState<number>(0);
  const [constrain, setConstrain] = useState<boolean>(true);
  const [direction, setDirection] = useState<string>();
  const [velocity, setVelocity] = useState<number>(0);

  const getDirection = () => {
    return velocity >= 1 ? "right" : velocity <= -1 ? "left" : undefined;
  };

  const getMovementState = () => {
    setVelocity(x.getVelocity());
    setDirection(getDirection());
  };

  //Swipe left or Right?
  const getResult = (childNode: any, parentNode: any) => {
    const child = childNode.getBoundingClientRect();
    const parent = parentNode.getBoundingClientRect();
    const result =
      parent.left >= child.right
        ? false
        : parent.right <= child.left
          ? true
          : undefined;
    return result;
  };

  //Speed to trigger swipe
  const flyAway = (min: number) => {
    const flyAwayDistance = (direction: string) => {
      const parentWidth = cardEl.current.parentNode.getBoundingClientRect()
        .width;
      const childWidth = cardEl.current.getBoundingClientRect().width;
      return direction === "left"
        ? -parentWidth / 2 - childWidth / 2
        : parentWidth / 2 + childWidth / 2;
    };

    if (direction && Math.abs(velocity) > min) {
      setConstrain(false);
      control.start({
        x: flyAwayDistance(direction),
      });
    }
  };

  //Event listener for card drag
  useEffect(() => {
    const unsubscribe = x.onChange(() => {
      const childNode = cardEl.current;
      const parentNode = cardEl.current.parentNode;
      const result = getResult(childNode, parentNode);
      setShiftedPosition(childNode.getBoundingClientRect().x - initialPosition);
      if (result !== undefined) {
        handleSwipeResult(profile, result);
      }
    });
    return () => unsubscribe();
  });

  //Initial position of Card
  useEffect(() => {
    setInitialPosition(cardEl.current.getBoundingClientRect().x);
  }, [loading]);

  //Handling Button press
  useEffect(() => {
    setTimeout(() => {
      if (likeState === "like") {
        handleSwipeResult(profile, true);
      } else if (likeState === "reject") {
        handleSwipeResult(profile, false);
      }
    }, 450);
  }, [likeState]);

  //For loading spinner
  const handleLoaded = () => {
    counter.current += 1;
    if (counter.current >= length) {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="motion-wrap"
      animate={control}
      dragConstraints={constrain && { left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      ref={cardEl}
      style={{ x }}
      onDrag={getMovementState}
      onDragEnd={() => flyAway(500)}
      drag={drag}
    >
      <div
        className={`carditem-wrapper ${drag && likeState}`}
        style={{
          transform: `rotate(${shiftedPosition / 50}deg) scale(${drag ? 1.006 : 1
            })`,
        }}
      >
        <img
          onLoad={handleLoaded}
          className="carditem-image"
          src={profile.image}
          alt={profile.name}
          draggable="false"
        ></img>
        <div className="status-wrapper">
          <img
            src={pass}
            alt="pass"
            style={{ opacity: `${shiftedPosition / 400}` }}
            className="carditem-icon"
          ></img>
          <h2
            style={{ opacity: `${shiftedPosition / 400}`, color: "lightgreen" }}
          >
            LIKE
          </h2>
        </div>
        <div className="status-wrapper">
          <img
            src={reject}
            alt="reject"
            style={{ opacity: `${-shiftedPosition / 400}` }}
            className="carditem-icon"
          ></img>
          <h2 style={{ opacity: `${-shiftedPosition / 400}`, color: "red" }}>
            NOPE
          </h2>
        </div>
        <div className="carditem-textwrap">
          <h1 className="carditem-name">
            {profile.name} {profile.age}
          </h1>
          <h2 className="carditem-description">{profile.description}</h2>
        </div>
      </div>
    </motion.div>
  );
};

export default CardItem;
