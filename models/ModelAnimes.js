class ModelAnime {
  constructor() {

  }

  new() {
    return new Promise((resolve, reject) => {
      animesdb.insert(nuevo, function(err, record) {
    		if (err) {
          reject(new Error(err));
    			return;
    		}
    		resolve(record);
    	});
    });
  }
}
