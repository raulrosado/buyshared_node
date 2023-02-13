const fs = require('fs').promises


class RemoveService {
    constructor() {}
	async removeImage(image){
		console.log('File to removed:'+image)
	 	fs.unlink(`./public/images/${image}`)
	        .then(() => {
	            console.log('File removed')
	            return true

	    }).catch(err => {
	            console.error('Something wrong happened removing the file', err)
	            return false
	        })
	}
}

