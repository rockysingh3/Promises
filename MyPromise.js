const State = {
    FULFILLED: 'fulfilled', 
    REJECTED: 'rejected',
    PENDING: 'pending'
}

class MyPromise {

    #thenCallbacks = [];
    #catchcallbacks = [];
    #state = State.PENDING;
    #value
    #onSuccessBind = this.#onSuccess.bind(this);
    #onFailBind = this.#onFail.bind(this);

    /* Every promise gets it own constructor */
    constructor(callback) {
        /* throw the callback in try catch so 
        there is an error the promise can throw the error
         */
        try {
            /* the callback takes two states of the promise  */
            callback(this.#onSuccessBinded, this.#onFailBind);
        } catch (error) {
            this.reject(error);
        }
    } 

    #runCallbacks() {

        /* loop through the array of callbacks return the value depending on the state  */

        if(this.#state == STATE.FULFILLED) {
            this.#thenCallbacks.forEach(callback => {
                callback(this.#value);
            });

            // remove all the callbacks from the array 
            this.#thenCallbacks = []

        }

        if(this.#state == STATE.REJECTED) {
            this.#thenCatchcallbacks.forEach(callback => {
                callback(this.#value);
            });

            // remove all the callbacks from the array 
            this.#catchcallbacks = []
        }
    }
 

    #onSuccess(value) {
        /* once this function resolves the micro task will
        sure this will run after the current task has completed in the queue */
        queueMicrotask(() => {

            // make sure you can't call resolve multipletimes in the same promise
            if (this.#state !== State.PENDING) return;


            // for when .then is returning another promise 
            if(value instanceof MyPromise) {
                value.then(this.#onSuccessBind, this.#onFailBind);
                return 
            }


            this.#value = value;
            // update the state when the promise resolves
            this.#state = State.FULFILLED;

        })

    }

    #onFail(value) {
        /* once this function resolves the micro task will
        sure this will run after the current task has completed in the queue */
        queueMicrotask(() => {

        
            // make sure you can't call reject multipletimes in the same promise
            if (this.#state !== State.PENDING) return;


            // for when .then is returning another promise 
            if(value instanceof MyPromise) {
                value.then(this.#onSuccessBind, this.#onFailBind);
                return 
            }

            this.#value = value;
            // update the state when the promise is rejected 
            this.#state = State.REJECTED;

        })
    }

    then(thenCb, catchCb) {
        /* Each then returns a new promise */
        return new MyPromise((resolve, reject) => {
            this.#thenCallbacks.push(result => {
                if(thenCb == null) {
                    resolve(result);
                    return;
                }

                try {
                    resolve(thenCb(result));
                } catch (error) {
                    reject(error);
                }
            })

            this.#catchcallbacks.push(result => {
                if(catchCb == null) {
                    reject(result);
                    return;
                }

                try {
                    resolve(catchCb(result));
                } catch (error) {
                    reject(error);
                }
            })

             /* push all the callbacks into a  array  */
            if(thenCb != null) this.#thenCallbacks.push();
            if(catchCb != null) this.#catchcallbacks.push(catchCb);  

        this.#runCallbacks()
        })
    }

    catch(cb) {
        
        this.then(undefined, cb);
    }

    finally(cb) {
        return this.then(result => {
            cb();
            return result;
        }, result => {
            cb();
            throw result;
        })
    }
} // end of promise class 

const p = new Promise(() => {

})


module.exports = MyPromise;