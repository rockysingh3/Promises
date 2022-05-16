class MyPromise {

    /* Every promise gets it own constructor */
    constructor(callback) {
        /* throw the callback in try catch so 
        there is an error the promise can throw the error
         */
        try {
            /* the callback takes two states of the promise  */
            callback(this.onSuccess, this.onFail);
        } catch (error) {
            this.reject(error);
        }
    } 
 

    resolve(value) {

    }

    reject(value) {

    }

}

const p = new Promise(() => {

})


module.exports = MyPromise;