function fetchTravels() {
  return fetch('data/travels.json')
    .then(response => {
      return response.json()
    })
}

function createMap() {
  return new Promise((resolve) => {
    ymaps.ready(function () {
      const map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 9,
        controls: ['zoomControl']
      })

      const clusterer = new ymaps.Clusterer()
      map.geoObjects.add(clusterer);

      resolve({
        add(object) {
          clusterer.add(object)
        },
        updateBounds() {
          map.setBounds(map.geoObjects.getBounds())
        }
      })
    })
  })
}

function renderPostOnMap(post, map) {
  post.photos.forEach(photo => {
    if (photo.coordinates.lat && photo.coordinates.lng) {
      const placemark = new ymaps.Placemark([photo.coordinates.lat, photo.coordinates.lng], {},
        {
          iconLayout: 'default#image',
          iconImageHref: 'icon.png',
          iconImageSize: [30, 30],
          iconImageOffset: [-5, -38]
        }
      )
      map.add(placemark)
    }
  })
}

function renderTravelOnMap(travel, map) {
  travel.posts.forEach((post) => {
    renderPostOnMap(post, map)
  })
}

async function run() {
  const map = await createMap()
  const travels = await fetchTravels()

  travels.forEach(travel => {
    renderTravelOnMap(travel, map)
  })

  map.updateBounds()
}

run()