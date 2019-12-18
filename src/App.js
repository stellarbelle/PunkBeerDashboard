import React, { useEffect, useState, useReducer } from 'react';
import './App.css';

const initialState = {
  favorites: [],
  loading: true,
}

const favorites = window.localStorage.getItem("beerApiFavorites")
if(favorites && favorites.length) {
  let favArr = favorites.split(",").map(function(item) {
      return parseInt(item, 10);
  });
  initialState.favorites = favArr
}

function setFavorites(state, data) {
  state.favorites = data
  let newState = {...state}
  return newState
}

function addFavorite(state, data) {
  state.favorites.push(data.id)
  let newState = {...state}
  window.localStorage.setItem("beerApiFavorites", newState.favorites)
  return newState
}

function removeFavorite(state, data) {
  let idx = state.favorites.indexOf(data.id)
  state.favorites.splice(idx, 1)
  let newState = {...state}
  window.localStorage.setItem("beerApiFavorites", newState.favorites)
  return newState
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_FAVORITE":
      return addFavorite(state, action.data)
    case "REMOVE_FAVORITE":
      return removeFavorite(state, action.data)
    case "SET_FAVORITES":
      return setFavorites(state, action.data)
    default:
    return state
  }
}

export function Favorite({beer}) {
  const [state, dispatch] = useReducer(reducer, initialState)
  let beerId = beer.id
  let action = "ADD_FAVORITE"
  let className = "rating fa fa-star"
  if(state.favorites.indexOf(beerId) >= 0) {
    action = "REMOVE_FAVORITE"
    className = "rating fa fa-star checked"
  }
  return <div className={className} onClick={() => dispatch({type: action, data: beer})}></div>
}

const App = () => {
  const [beers, setBeers] = useState([])
  const [value, setValue] = useState("")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [favorites, setFavorites] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=6${query}`)
      const json = await res.json()
      setBeers(json)
    }
    fetchData();
  }, [page, query, state.favorites]);

  function handleChange(e) {
    let value = e.target.value ? e.target.value.toLowerCase().trim() : ""
    setValue(value)
  }
  function handleFavoriteQuery({favorites}) {
    let query = "&ids="
    favorites.forEach(id => {
      query = `${query}${id}|`
    })
    setQuery(query)
    setFavorites(true)
  }
  function handleHomePage() {
    setQuery("")
    setFavorites(false)
  }
  return (
    <div className="app-wrapper">
      <div className="app-header">
        <div className="header-title">Punk Beer Project</div>
        <div className="button-wrapper">
          <div className={`home-button ${favorites ? "" : "active"}`} onClick={() => handleHomePage()}>Home</div>
          <div className={`favorites-button ${favorites ? "active" : ""}`} onClick={() => handleFavoriteQuery(state)}>Favorites</div>
        </div>
      </div>
      <div className="search-bar">
        <input
         value={value}
         placeholder="Search for beer..."
         onChange={handleChange}
        />
       <button className="search-button" onClick={() => setQuery(`&beer_name=${value}`)}>Search</button>
      </div>
      <div className="app-body">
        <div className="beer-cards-wrapper">
          {beers && beers.map(beer => (
            <div className="beer-card" key={beer.id}>
              <Favorite
                beer={beer}
              />
              <img alt="" className="beer-image" src={beer.image_url} />
              <div className="beer-info">
                <div className="beer-title">{beer.name}</div>
                <div className="beer-description">{beer.description}</div>
              </div>
            </div>
          ))}
          {!beers.length &&
            <div className="default-screen">
              <div className="default-header">
                <div>No beers match your criteria at this time</div>
                <div>please revise your search or add to your favorites</div>
              </div>
              <iframe src="https://giphy.com/embed/Vdytz82ynweJB8nBTE" width="480" height="360" frameBorder="0" className="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/weekend-cheers-prost-Vdytz82ynweJB8nBTE"></a></p>
            </div>
          }
        </div>
        {beers.length &&
          <div className="page-back">
            {page !== 1 && <span onClick={() => setPage(page-1)}>{`< previous `}</span>}
            <span onClick={() => setPage(page+1)}>{`next >`}</span>
          </div>
        }
      </div>
    </div>
  );
}


export default App;
