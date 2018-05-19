class ModelAnime {
  constructor() {

  }

  new(anime) {
    return new Promise((resolve, reject) => {
      animesdb.insert(anime, function(err, record) {
    		if (err) {
          reject(new Error(err));
    			return;
    		}
    		resolve(record);
    	});
    });
  }
}
