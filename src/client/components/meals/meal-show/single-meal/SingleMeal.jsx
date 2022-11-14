import React, { useState } from 'react';
import './SingleMeal.css';
import ReservationForm from './../reservation/ReservationForm';
import useReservation from '../../../hooks/UseReservation';

const SingleMeal = ({ meal, success, setSuccess }) => {
  const mealDate = new Date(meal.accessibility_time);
  const [hours, minutes] = [mealDate.getHours(), mealDate.getMinutes()];
  const numberOfGuests = useReservation(meal.id, success);

  return (
    <div className="single-meal__content">
      <div className="single-meal__info">
        <h2>{meal.title}</h2>
        <div className="single-meal__description">
          <h4>Description:</h4>
          <p>{meal.description}</p>
        </div>
        <div className="single-meal__location">
          <h4>Where:</h4>
          <p className="single-meal__location">{meal.location}</p>
        </div>
        <div>
          <h4>When:</h4>
          <p>{mealDate.toDateString()}</p>
          <p>
            {hours}:{minutes > 10 ? minutes : '0' + minutes}
          </p>
        </div>
        <div>
          <h4>Reserved:</h4>
          <p>
            {numberOfGuests === 0 ? '-' : numberOfGuests}/
            {meal.max_reservations}
          </p>
        </div>
        <div>
          <h4>Price: </h4>
          <p>{meal.price}</p>
        </div>
      </div>
      <div className="single-meal__img">
        <img src={meal.image_url} alt={meal.title} />
      </div>
      <div className="single-meal__reservation">
        {numberOfGuests === meal.max_reservations ? (
          <p className="single-meal__full">No reservations left</p>
        ) : (
          <ReservationForm
            meal={meal}
            numberOfGuests={numberOfGuests}
            success={success}
            setSuccess={setSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default SingleMeal;
