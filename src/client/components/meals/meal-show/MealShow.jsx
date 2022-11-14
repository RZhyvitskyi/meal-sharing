import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SingleMeal from './single-meal/SingleMeal';

const meal_url = (id) => `/api/meals/${id}`;

const MealShow = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchMeal = async (mealId) => {
      try {
        const req = await fetch(meal_url(mealId), { signal: abortCont.signal });
        const data = await req.json();

        setMeal(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMeal(id);

    return () => abortCont.abort();
  }, []);

  return (
    <div className="container">
      {meal ? (
        <SingleMeal meal={meal} success={success} setSuccess={setSuccess} />
      ) : (
        'Not found'
      )}
    </div>
  );
};

export default MealShow;
